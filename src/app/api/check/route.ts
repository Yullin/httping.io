import { NextRequest, NextResponse } from "next/server";
import https from "https";
import http from "http";
import { URL } from "url";
import tls from "tls";

interface RedirectStep {
  url: string;
  status: number;
}

interface TLSInfo {
  valid: boolean;
  issuer: string;
  subject: string;
  validFrom: string;
  validTo: string;
  daysRemaining: number;
  protocol: string;
}

interface CheckResult {
  url: string;
  finalUrl: string;
  status: number;
  statusText: string;
  responseTime: number;
  ttfb: number;
  headers: Record<string, string>;
  redirects: RedirectStep[];
  tls: TLSInfo | null;
  ip: string;
  error?: string;
}

const STATUS_TEXT: Record<number, string> = {
  100: "Continue", 101: "Switching Protocols", 102: "Processing",
  200: "OK", 201: "Created", 202: "Accepted", 204: "No Content",
  206: "Partial Content",
  301: "Moved Permanently", 302: "Found", 303: "See Other",
  304: "Not Modified", 307: "Temporary Redirect", 308: "Permanent Redirect",
  400: "Bad Request", 401: "Unauthorized", 403: "Forbidden",
  404: "Not Found", 405: "Method Not Allowed", 408: "Request Timeout",
  409: "Conflict", 410: "Gone", 429: "Too Many Requests",
  500: "Internal Server Error", 501: "Not Implemented",
  502: "Bad Gateway", 503: "Service Unavailable", 504: "Gateway Timeout",
};

function getTLSInfo(socket: tls.TLSSocket): TLSInfo {
  const cert = socket.getPeerCertificate();
  const validTo = new Date(cert.valid_to);
  const now = new Date();
  const daysRemaining = Math.floor(
    (validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  const toStr = (v: string | string[] | undefined): string =>
    Array.isArray(v) ? v.join(", ") : v || "Unknown";
  const issuerCN = toStr(cert.issuer?.CN) !== "Unknown" ? toStr(cert.issuer?.CN) : toStr(cert.issuer?.O);
  const subjectCN = toStr(cert.subject?.CN);

  return {
    valid: socket.authorized,
    issuer: issuerCN,
    subject: subjectCN,
    validFrom: new Date(cert.valid_from).toISOString(),
    validTo: validTo.toISOString(),
    daysRemaining,
    protocol: socket.getProtocol() || "TLS",
  };
}

async function checkUrl(
  targetUrl: string,
  redirects: RedirectStep[] = [],
  depth = 0
): Promise<CheckResult> {
  if (depth > 10) {
    throw new Error("Too many redirects (>10)");
  }

  return new Promise((resolve, reject) => {
    let parsed: URL;
    try {
      parsed = new URL(targetUrl);
    } catch {
      return reject(new Error("Invalid URL"));
    }

    const isHttps = parsed.protocol === "https:";
    const lib = isHttps ? https : http;
    const port = parsed.port
      ? parseInt(parsed.port)
      : isHttps
      ? 443
      : 80;

    const options = {
      hostname: parsed.hostname,
      port,
      path: parsed.pathname + parsed.search,
      method: "GET",
      timeout: 15000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; httping.io/1.0; +https://httping.io)",
        Accept: "text/html,application/json,*/*",
        "Accept-Encoding": "identity",
        Connection: "close",
      },
      rejectUnauthorized: false,
    };

    const startTime = Date.now();
    let ttfb = 0;
    let tlsInfo: TLSInfo | null = null;
    let serverIp = "";

    const req = lib.request(options, (res) => {
      ttfb = Date.now() - startTime;

      // Capture IP
      const socket = res.socket as tls.TLSSocket;
      serverIp = socket.remoteAddress || "";

      // TLS info
      if (isHttps && socket && "getPeerCertificate" in socket) {
        try {
          tlsInfo = getTLSInfo(socket as tls.TLSSocket);
        } catch {
          tlsInfo = null;
        }
      }

      const statusCode = res.statusCode || 0;
      const headers: Record<string, string> = {};

      Object.entries(res.headers).forEach(([key, val]) => {
        if (val) {
          headers[key] = Array.isArray(val) ? val.join(", ") : val;
        }
      });

      // Handle redirect
      if (
        [301, 302, 303, 307, 308].includes(statusCode) &&
        res.headers.location
      ) {
        redirects.push({ url: targetUrl, status: statusCode });
        let nextUrl = res.headers.location;
        if (!nextUrl.startsWith("http")) {
          nextUrl = `${parsed.protocol}//${parsed.host}${nextUrl}`;
        }
        res.resume(); // drain
        req.destroy();
        checkUrl(nextUrl, redirects, depth + 1)
          .then(resolve)
          .catch(reject);
        return;
      }

      // Drain response body
      res.resume();
      res.on("end", () => {
        const responseTime = Date.now() - startTime;
        resolve({
          url: redirects.length > 0 ? redirects[0].url : targetUrl,
          finalUrl: targetUrl,
          status: statusCode,
          statusText: STATUS_TEXT[statusCode] || "Unknown",
          responseTime,
          ttfb,
          headers,
          redirects,
          tls: tlsInfo,
          ip: serverIp,
        });
      });
    });

    req.on("timeout", () => {
      req.destroy();
      reject(new Error("TIMEOUT"));
    });

    req.on("error", (err) => {
      reject(err);
    });

    req.end();
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  let normalized = url.trim();
  if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
    normalized = "https://" + normalized;
  }

  try {
    new URL(normalized);
  } catch {
    return NextResponse.json({ error: "INVALID_URL" }, { status: 400 });
  }

  try {
    const result = await checkUrl(normalized);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message === "TIMEOUT") {
      return NextResponse.json({ error: "TIMEOUT" }, { status: 408 });
    }
    if (message === "Invalid URL") {
      return NextResponse.json({ error: "INVALID_URL" }, { status: 400 });
    }
    return NextResponse.json(
      { error: "FETCH_FAILED", message },
      { status: 502 }
    );
  }
}
