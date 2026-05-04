import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Globe } from "lucide-react";

// ── 完整状态码数据库 ──────────────────────────────────────────────────
interface StatusInfo {
  code: number;
  name: string;
  category: "1xx" | "2xx" | "3xx" | "4xx" | "5xx";
  summary: string;
  description: string;
  useCases: string[];
  example?: string;
}

const STATUS_DB: Record<number, StatusInfo> = {
  // 1xx
  100: { code: 100, name: "Continue", category: "1xx", summary: "The server has received the request headers and the client should proceed.", description: "The 100 Continue status indicates that the server has received the request headers and the client should proceed to send the request body. This is used when the client wants to send a large request body and checks with the server first.", useCases: ["Large file upload pre-check", "POST requests with Expect: 100-continue header"] },
  101: { code: 101, name: "Switching Protocols", category: "1xx", summary: "The requester has asked the server to switch protocols.", description: "The 101 Switching Protocols response indicates the server is switching to a different protocol as requested by the client via the Upgrade header. Commonly used to upgrade an HTTP connection to WebSocket.", useCases: ["WebSocket handshake upgrade", "HTTP/1.1 to HTTP/2 upgrade"] },
  102: { code: 102, name: "Processing", category: "1xx", summary: "The server has received and is processing the request, but no response is available yet.", description: "The 102 Processing response is an interim response used to inform the client that the server has accepted the request but has not yet completed it. Used in WebDAV.", useCases: ["WebDAV long-running operations"] },
  // 2xx
  200: { code: 200, name: "OK", category: "2xx", summary: "The request has succeeded.", description: "The 200 OK status is the most common HTTP response. It means the request was successful and the server is returning the requested resource. The actual response depends on the HTTP method: GET returns the resource, POST returns the result of the action.", useCases: ["Successful GET request", "Successful form submission", "API returning data"], example: "GET /api/users/1 → 200 OK with user data" },
  201: { code: 201, name: "Created", category: "2xx", summary: "The request has been fulfilled and a new resource has been created.", description: "The 201 Created status means the request succeeded and a new resource was created. The new resource's URI is typically returned in the Location header. Used with POST or PUT requests.", useCases: ["Creating a new user", "Uploading a file", "Submitting a new order"], example: "POST /api/users → 201 Created, Location: /api/users/42" },
  202: { code: 202, name: "Accepted", category: "2xx", summary: "The request has been accepted for processing, but the processing has not been completed.", description: "The 202 Accepted status means the request has been accepted for processing, but the processing is not complete. It's intentionally non-committal — the request may or may not be acted upon.", useCases: ["Async task queuing", "Batch processing jobs", "Email sending queue"] },
  204: { code: 204, name: "No Content", category: "2xx", summary: "The server successfully processed the request, but is not returning any content.", description: "The 204 No Content status means the server successfully processed the request but is not returning any content. Commonly used for DELETE operations or PUT updates where no response body is needed.", useCases: ["DELETE request success", "PUT/PATCH update without response body", "Preflight OPTIONS response"] },
  206: { code: 206, name: "Partial Content", category: "2xx", summary: "The server is delivering only part of the resource due to a range header sent by the client.", description: "The 206 Partial Content status is used when the client requests part of a resource via the Range header. Common in video streaming and download resumption.", useCases: ["Video streaming (seeking)", "Resumable downloads", "Chunked content delivery"], example: "GET /video.mp4 with Range: bytes=0-1023 → 206" },
  // 3xx
  301: { code: 301, name: "Moved Permanently", category: "3xx", summary: "The URL of the requested resource has been changed permanently.", description: "The 301 Moved Permanently redirect status means the resource has been permanently moved to a new URL. Search engines update their index to the new URL. The browser caches this redirect.", useCases: ["Permanent domain migration", "HTTP to HTTPS redirect", "URL restructuring for SEO"], example: "http://example.com → 301 → https://example.com" },
  302: { code: 302, name: "Found", category: "3xx", summary: "The URL of the requested resource has been changed temporarily.", description: "The 302 Found redirect means the resource temporarily lives at a different URI. Unlike 301, search engines don't update their index. The original URL is preserved.", useCases: ["Temporary maintenance redirect", "Login redirect flow", "A/B testing redirect"] },
  303: { code: 303, name: "See Other", category: "3xx", summary: "The response to the request can be found at another URI using a GET method.", description: "The 303 See Other redirect means the response to the request can be found under a different URI and should be retrieved using GET. Used to redirect after a POST request (Post/Redirect/Get pattern).", useCases: ["Post/Redirect/Get (PRG) pattern", "Form submission redirect", "Payment confirmation redirect"] },
  304: { code: 304, name: "Not Modified", category: "3xx", summary: "There is no need to retransmit the requested resources.", description: "The 304 Not Modified response tells the client that the cached version of the resource is still valid. The server doesn't return the content, saving bandwidth. Used with If-Modified-Since or If-None-Match headers.", useCases: ["Browser cache validation", "CDN cache hits", "API response caching with ETags"] },
  307: { code: 307, name: "Temporary Redirect", category: "3xx", summary: "The resource is temporarily under a different URL, method and body not changed.", description: "The 307 Temporary Redirect is similar to 302 but guarantees that the HTTP method and body won't change when redirected. If the original request was POST, the redirected request is also POST.", useCases: ["Temporary API endpoint migration", "Maintaining POST data in redirect", "Load balancer temporary routing"] },
  308: { code: 308, name: "Permanent Redirect", category: "3xx", summary: "The resource is now permanently located at another URI, method and body not changed.", description: "The 308 Permanent Redirect is the strict equivalent of 301 but guarantees the HTTP method and body are preserved. Ideal for permanently moving API endpoints without breaking POST requests.", useCases: ["Permanent API migration", "Maintaining POST in permanent redirect", "HTTPS enforcement with method preservation"] },
  // 4xx
  400: { code: 400, name: "Bad Request", category: "4xx", summary: "The server cannot or will not process the request due to a client error.", description: "The 400 Bad Request status means the server cannot process the request due to invalid syntax or malformed request. The client should not repeat the request without modifications.", useCases: ["Invalid JSON body", "Missing required parameters", "Invalid query string format"], example: "POST /api/users with malformed JSON → 400 Bad Request" },
  401: { code: 401, name: "Unauthorized", category: "4xx", summary: "Authentication is required and has failed or has not yet been provided.", description: "The 401 Unauthorized status means the request requires authentication. Despite its name, it really means 'unauthenticated'. The response must include a WWW-Authenticate header indicating how to authenticate.", useCases: ["Missing Bearer token", "Expired JWT", "Invalid API key"] },
  403: { code: 403, name: "Forbidden", category: "4xx", summary: "The client does not have access rights to the content.", description: "The 403 Forbidden status means the server understood the request but refuses to authorize it. Unlike 401, authentication will not help. The client is known but does not have permission.", useCases: ["Accessing admin-only resources", "IP blocking", "File permissions denied"], example: "GET /admin with regular user token → 403 Forbidden" },
  404: { code: 404, name: "Not Found", category: "4xx", summary: "The server can not find the requested resource.", description: "The 404 Not Found status is the most famous HTTP error. It means the server cannot find the requested resource. The URL may be broken, or the resource may have been deleted or moved.", useCases: ["Deleted pages", "Broken links", "Wrong URL paths", "Missing API endpoints"], example: "GET /page-that-doesnt-exist → 404 Not Found" },
  405: { code: 405, name: "Method Not Allowed", category: "4xx", summary: "The request method is known by the server but has been disabled and cannot be used.", description: "The 405 Method Not Allowed status means the HTTP method used is not supported for that resource. The server must include an Allow header listing the supported methods.", useCases: ["POST to a read-only endpoint", "DELETE not supported", "PUT on a collection URL"] },
  408: { code: 408, name: "Request Timeout", category: "4xx", summary: "The server would like to shut down this unused connection.", description: "The 408 Request Timeout status means the server did not receive a complete request message within the time it was prepared to wait. The client may repeat the request.", useCases: ["Slow network connection", "Client stalled mid-upload", "Idle connection cleanup"] },
  409: { code: 409, name: "Conflict", category: "4xx", summary: "The request conflicts with the current state of the server.", description: "The 409 Conflict status indicates the request conflicts with the current state of the server. Common when trying to create a duplicate resource or when concurrent edits conflict.", useCases: ["Duplicate username registration", "Edit conflict (optimistic locking)", "Version mismatch in APIs"] },
  410: { code: 410, name: "Gone", category: "4xx", summary: "The resource requested is no longer available and will not be available again.", description: "The 410 Gone status is like 404 but indicates the resource was intentionally removed and won't come back. Search engines should remove 410 pages from their index faster than 404s.", useCases: ["Permanently deleted content", "Expired promotions", "Sunset API endpoints"] },
  418: { code: 418, name: "I'm a Teapot", category: "4xx", summary: "The server refuses the attempt to brew coffee with a teapot.", description: "The 418 I'm a Teapot is an April Fools' joke from 1998 (RFC 2324). Any attempt to brew coffee with a teapot should result in this error. It became an unofficial part of HTTP and is used humorously.", useCases: ["Easter eggs in APIs", "Humor and culture", "Indicating non-standard behavior"] },
  422: { code: 422, name: "Unprocessable Entity", category: "4xx", summary: "The server understands the content type but was unable to process the contained instructions.", description: "The 422 Unprocessable Entity status means the server understands the content type and syntax, but cannot process the contained instructions. Common in REST APIs for validation errors.", useCases: ["Form validation failure", "Invalid data format", "Business logic validation errors"], example: "POST /api/users with {age: -5} → 422 Unprocessable Entity" },
  429: { code: 429, name: "Too Many Requests", category: "4xx", summary: "The user has sent too many requests in a given amount of time.", description: "The 429 Too Many Requests status means the user has sent too many requests in a given time period (rate limiting). The response should include a Retry-After header.", useCases: ["API rate limiting", "Login attempt throttling", "DDoS protection"], example: "Exceeding 100 API calls/minute → 429 Too Many Requests" },
  // 5xx
  500: { code: 500, name: "Internal Server Error", category: "5xx", summary: "The server encountered an unexpected condition that prevented it from fulfilling the request.", description: "The 500 Internal Server Error is a generic server-side error. It means something went wrong on the server but it cannot be more specific. Check server logs to diagnose the root cause.", useCases: ["Unhandled exceptions", "Database connection failure", "Application bugs"], example: "Uncaught exception in server code → 500 Internal Server Error" },
  501: { code: 501, name: "Not Implemented", category: "5xx", summary: "The server does not support the functionality required to fulfill the request.", description: "The 501 Not Implemented status means the server does not support the HTTP method used in the request. Unlike 405, this means the server doesn't recognize the method at all.", useCases: ["Unsupported HTTP methods", "Feature not yet implemented", "WebDAV method on non-WebDAV server"] },
  502: { code: 502, name: "Bad Gateway", category: "5xx", summary: "The server was acting as a gateway or proxy and received an invalid response.", description: "The 502 Bad Gateway status means a server acting as a gateway or proxy received an invalid response from an upstream server. Common when your backend server crashes or returns invalid data.", useCases: ["Backend server crash", "Upstream service returning errors", "Reverse proxy misconfiguration"] },
  503: { code: 503, name: "Service Unavailable", category: "5xx", summary: "The server is not ready to handle the request, often due to maintenance or overload.", description: "The 503 Service Unavailable status means the server is temporarily unable to handle the request. This can be due to server overload or scheduled maintenance. The Retry-After header may indicate when to try again.", useCases: ["Planned maintenance", "Server overload", "Deployment downtime", "Auto-scaling lag"], example: "Server under heavy load → 503 Service Unavailable" },
  504: { code: 504, name: "Gateway Timeout", category: "5xx", summary: "The server, while acting as a gateway, did not receive a timely response from an upstream server.", description: "The 504 Gateway Timeout means a server acting as a gateway didn't receive a timely response from an upstream server. Similar to 502 but specifically for timeouts rather than invalid responses.", useCases: ["Slow database queries", "Upstream API timeout", "Long-running computations exceeding proxy timeout"] },
};

const CATEGORY_COLOR: Record<string, string> = {
  "1xx": "text-blue-400 bg-blue-400/10 border-blue-400/20",
  "2xx": "text-green-400 bg-green-400/10 border-green-400/20",
  "3xx": "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  "4xx": "text-orange-400 bg-orange-400/10 border-orange-400/20",
  "5xx": "text-red-400 bg-red-400/10 border-red-400/20",
};

const CATEGORY_LABEL: Record<string, string> = {
  "1xx": "Informational",
  "2xx": "Success",
  "3xx": "Redirection",
  "4xx": "Client Error",
  "5xx": "Server Error",
};

// Static params for all known codes
export async function generateStaticParams() {
  return Object.keys(STATUS_DB).map((code) => ({ code }));
}

// Dynamic metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const info = STATUS_DB[Number(code)];
  if (!info) return { title: "HTTP Status Code — httping.io" };

  return {
    title: `${info.code} ${info.name} — HTTP Status Code | httping.io`,
    description: `HTTP ${info.code} ${info.name}: ${info.summary} Learn when it occurs, common causes, and how to fix it.`,
    openGraph: {
      title: `HTTP ${info.code} ${info.name} | httping.io`,
      description: info.summary,
    },
    alternates: {
      canonical: `https://www.httping.io/status/${info.code}`,
    },
  };
}

export default async function StatusCodePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const info = STATUS_DB[Number(code)];

  if (!info) notFound();

  const colorClass = CATEGORY_COLOR[info.category];

  // Related codes (same category)
  const related = Object.values(STATUS_DB)
    .filter((s) => s.category === info.category && s.code !== info.code)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Nav */}
      <nav className="border-b border-white/5 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              httping<span className="text-violet-400">.io</span>
            </span>
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to HTTP Check Tool
        </Link>

        {/* Hero */}
        <div className="mb-10">
          <div className={clsx("inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm mb-4", colorClass)}>
            {info.category} · {CATEGORY_LABEL[info.category]}
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
            <span className={clsx("font-mono", colorClass.split(" ")[0])}>{info.code}</span>
            <span className="text-white ml-3">{info.name}</span>
          </h1>

          <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
            {info.summary}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h2 className="text-base font-semibold text-white mb-3">What is HTTP {info.code}?</h2>
              <p className="text-gray-400 leading-relaxed">{info.description}</p>
            </div>

            {/* Example */}
            {info.example && (
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h2 className="text-base font-semibold text-white mb-3">Example</h2>
                <code className="block text-sm text-violet-300 bg-black/30 p-3 rounded-lg font-mono">
                  {info.example}
                </code>
              </div>
            )}

            {/* Try it */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20">
              <h2 className="text-base font-semibold text-white mb-2">Check a URL in real-time</h2>
              <p className="text-gray-400 text-sm mb-4">
                Use our HTTP ping tool to check the actual status code of any URL.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                <Globe className="w-4 h-4" />
                Try httping.io →
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Use cases */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <h2 className="text-sm font-semibold text-white mb-3">Common Use Cases</h2>
              <ul className="space-y-2">
                {info.useCases.map((uc, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className={clsx("mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0", colorClass.split(" ")[0].replace("text-", "bg-"))} />
                    {uc}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick facts */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <h2 className="text-sm font-semibold text-white mb-3">Quick Facts</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Code</span>
                  <span className="text-white font-mono">{info.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Category</span>
                  <span className={clsx("font-medium", colorClass.split(" ")[0])}>{info.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Type</span>
                  <span className="text-gray-300">{CATEGORY_LABEL[info.category]}</span>
                </div>
              </div>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <h2 className="text-sm font-semibold text-white mb-3">
                  Related {info.category} Codes
                </h2>
                <div className="flex flex-wrap gap-2">
                  {related.map((r) => (
                    <Link
                      key={r.code}
                      href={`/status/${r.code}`}
                      className={clsx(
                        "px-2.5 py-1 rounded-lg border text-xs font-mono hover:opacity-80 transition-opacity",
                        colorClass
                      )}
                    >
                      {r.code}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 mt-12">
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-300 transition-colors">httping.io</Link>
          {" · "}Built for developers who care about reliability.
        </div>
      </footer>
    </div>
  );
}

function clsx(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
