"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Loader2, ShieldCheck, ShieldX, ShieldOff, Clock, ArrowRight, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";
import clsx from "clsx";

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

type Lang = "en" | "zh";

const t = {
  en: {
    badge: "Free & Open Source",
    title: "HTTP",
    titleHighlight: "Ping Tool",
    subtitle: "Instantly inspect any URL — status code, response time, TTFB, redirect chain, TLS certificate and response headers.",
    placeholder: "https://example.com",
    button: "Check",
    buttonLoading: "Checking...",
    examples: ["https://github.com", "https://cloudflare.com", "https://vercel.com"],
    tryExample: "Try:",
    results: "Results",
    statusCode: "HTTP Status",
    responseTime: "Response Time",
    ttfb: "TTFB",
    redirects: "Redirects",
    noRedirects: "No redirects",
    tls: "TLS / SSL",
    tlsValid: "Valid",
    tlsExpired: "Expired",
    tlsNone: "No HTTPS",
    tlsIssuer: "Issuer",
    tlsExpiry: "Expires",
    tlsDays: "days remaining",
    headers: "Response Headers",
    ip: "Server IP",
    finalUrl: "Final URL",
    showHeaders: "Show all headers",
    hideHeaders: "Hide headers",
    errorInvalid: "Please enter a valid URL (e.g. https://example.com)",
    errorFailed: "Could not reach the URL. The server may be unreachable.",
    errorTimeout: "Request timed out after 15 seconds.",
    errorGeneric: "Something went wrong. Please try again.",
  },
  zh: {
    badge: "免费开源",
    title: "HTTP",
    titleHighlight: "探测工具",
    subtitle: "即时探测任意 URL——状态码、响应时间、TTFB、重定向链路、TLS 证书、响应头，就像 ping，但针对 HTTP。",
    placeholder: "https://example.com",
    button: "检测",
    buttonLoading: "检测中...",
    examples: ["https://github.com", "https://cloudflare.com", "https://vercel.com"],
    tryExample: "试试：",
    results: "检测结果",
    statusCode: "HTTP 状态码",
    responseTime: "响应时间",
    ttfb: "TTFB",
    redirects: "重定向链路",
    noRedirects: "无重定向",
    tls: "TLS / SSL",
    tlsValid: "有效",
    tlsExpired: "已过期",
    tlsNone: "未使用 HTTPS",
    tlsIssuer: "颁发机构",
    tlsExpiry: "到期时间",
    tlsDays: "天后到期",
    headers: "响应头",
    ip: "服务器 IP",
    finalUrl: "最终 URL",
    showHeaders: "展开所有响应头",
    hideHeaders: "收起响应头",
    errorInvalid: "请输入有效的 URL（如 https://example.com）",
    errorFailed: "无法访问该 URL，服务器可能不可达。",
    errorTimeout: "请求超时（超过 15 秒）。",
    errorGeneric: "出现了一些问题，请重试。",
  },
};

function statusColor(code: number): string {
  if (code >= 500) return "text-red-400 bg-red-400/10 border-red-400/30";
  if (code >= 400) return "text-orange-400 bg-orange-400/10 border-orange-400/30";
  if (code >= 300) return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
  if (code >= 200) return "text-green-400 bg-green-400/10 border-green-400/30";
  return "text-gray-400 bg-gray-400/10 border-gray-400/30";
}

function timingColor(ms: number): string {
  if (ms < 200) return "text-green-400";
  if (ms < 800) return "text-yellow-400";
  return "text-red-400";
}

export default function HttpPingTool() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("en");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showHeaders, setShowHeaders] = useState(false);
  const [copied, setCopied] = useState(false);
  const tx = t[lang];
  const didAutoCheck = useRef(false);

  // 读取 ?url= 参数，自动填入并触发检测
  useEffect(() => {
    if (didAutoCheck.current) return;
    const paramUrl = searchParams.get("url");
    if (paramUrl && paramUrl.trim()) {
      didAutoCheck.current = true;
      setUrl(paramUrl.trim());
      // 稍作延迟确保 state 更新后再触发检测
      setTimeout(() => check(paramUrl.trim()), 100);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const check = useCallback(async (targetUrl?: string) => {
    const input = (targetUrl || url).trim();
    if (!input) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setShowHeaders(false);

    // 更新地址栏 URL 参数，方便分享
    const normalized = input.startsWith("http") ? input : `https://${input}`;
    router.replace(`/?url=${encodeURIComponent(normalized)}`, { scroll: false });

    try {
      const res = await fetch(`/api/check?url=${encodeURIComponent(input)}`);
      const data: CheckResult & { error?: string } = await res.json();

      if (data.error) {
        const errMap: Record<string, string> = {
          INVALID_URL: tx.errorInvalid,
          TIMEOUT: tx.errorTimeout,
          FETCH_FAILED: tx.errorFailed,
        };
        setError(errMap[data.error] || tx.errorGeneric);
      } else {
        setResult(data);
      }
    } catch {
      setError(tx.errorGeneric);
    } finally {
      setLoading(false);
    }
  }, [url, tx, router]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") check();
  };

  const handleCopy = () => {
    // 直接复制当前地址栏（check 后已经更新为带 ?url= 的链接）
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Nav */}
      <nav className="border-b border-surface-1 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo-text.svg" alt="httping.io" className="h-8 w-auto" />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLang(lang === "en" ? "zh" : "en")}
              className="text-sm text-gray-400 hover:text-foreground transition-colors px-3 py-1 rounded-md border border-surface-2 hover:border-surface-3"
            >
              {lang === "en" ? "中文" : "EN"}
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col">
      {/* Hero */}
      <section className={clsx(
        "max-w-4xl mx-auto px-6 text-center",
        result ? "pt-20 pb-12" : "flex-1 flex flex-col items-center justify-center"
      )}>
        <div className="inline-flex items-center justify-center w-20 h-20 bg-surface-1 border border-surface-2 rounded-full mb-6">
          {/* io Logo - i inside O circle */}
          <div className="relative" style={{width: '48px', height: '48px'}}>
            {/* O - outer circle with pulse */}
            <div 
              className="absolute rounded-full"
              style={{
                width: '100%',
                height: '100%',
                border: '2.5px solid #34D399',
                animation: 'pulse-ring 2.5s ease-in-out infinite'
              }}
            />
            {/* O - outer subtle circle */}
            <div 
              className="absolute rounded-full"
              style={{
                width: 'calc(100% - 8px)',
                height: 'calc(100% - 8px)',
                top: '4px',
                left: '4px',
                border: '1.5px solid rgba(6, 182, 212, 0.4)'
              }}
            />
            {/* i - stem (vertical line inside circle, positioned lower) */}
            <div 
              className="absolute"
              style={{
                width: '3px',
                height: '18px',
                backgroundColor: '#06B6D4',
                borderRadius: '1.5px',
                left: '50%',
                top: '55%',
                transform: 'translate(-50%, -50%) translateY(3px)'
              }}
            />
            {/* i - dot (blinks, at top of stem) */}
            <div 
              className="absolute rounded-full"
              style={{
                width: '6px',
                height: '6px',
                backgroundColor: '#06B6D4',
                left: '50%',
                top: '30%',
                transform: 'translate(-50%, -50%)',
                animation: 'blink 2s ease-in-out infinite'
              }}
            />
          </div>
        </div>

        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-4">
          <span className="text-white">{tx.title} </span>
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            {tx.titleHighlight}
          </span>
        </h1>

        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          {tx.subtitle}
        </p>

        {/* Input */}
        <div className="relative max-w-2xl mx-auto">
          <div className="flex items-center gap-3 p-2 pl-5 rounded-2xl bg-surface-1 border border-surface-2 focus-within:border-violet-500/50 focus-within:bg-surface-1 transition-all shadow-xl shadow-black/20">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={tx.placeholder}
              className="flex-1 bg-transparent outline-none text-foreground placeholder-gray-500 text-base min-w-0"
              autoComplete="off"
              spellCheck={false}
            />
            <button
              onClick={() => check()}
              disabled={loading || !url.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/20"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              {loading ? tx.buttonLoading : tx.button}
            </button>
          </div>
        </div>

        {/* Example links */}
        <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
          <span className="text-gray-500 text-sm">{tx.tryExample}</span>
          {tx.examples.map((ex) => (
            <button
              key={ex}
              onClick={() => { setUrl(ex); check(ex); }}
              className="text-sm text-gray-400 hover:text-violet-400 transition-colors underline underline-offset-2"
            >
              {ex.replace("https://", "")}
            </button>
          ))}
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="max-w-4xl mx-auto px-6 mb-8">
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3">
            <ShieldX className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="max-w-4xl mx-auto px-6 pb-20 space-y-4 animate-in fade-in duration-500">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">{tx.results}</h2>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-foreground transition-colors px-3 py-1.5 rounded-lg border border-surface-2 hover:border-surface-3"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? (lang === "en" ? "Copied!" : "已复制！") : (lang === "en" ? "Copy link" : "复制链接")}
            </button>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Status */}
            <div className={clsx("p-4 rounded-xl border", statusColor(result.status))}>
              <div className="text-xs opacity-60 mb-1">{tx.statusCode}</div>
              <div className="text-2xl font-bold">{result.status}</div>
              <div className="text-xs opacity-70 mt-0.5">{result.statusText}</div>
            </div>

            {/* Response time */}
            <div className="p-4 rounded-xl bg-surface-1 border border-surface-2">
              <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {tx.responseTime}
              </div>
              <div className={clsx("text-2xl font-bold", timingColor(result.responseTime))}>
                {result.responseTime}<span className="text-sm font-normal text-gray-400 ml-1">ms</span>
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {result.responseTime < 200 ? "🟢 Fast" : result.responseTime < 800 ? "🟡 OK" : "🔴 Slow"}
              </div>
            </div>

            {/* TTFB */}
            <div className="p-4 rounded-xl bg-surface-1 border border-surface-2">
              <div className="text-xs text-gray-400 mb-1">{tx.ttfb}</div>
              <div className={clsx("text-2xl font-bold", timingColor(result.ttfb))}>
                {result.ttfb}<span className="text-sm font-normal text-gray-400 ml-1">ms</span>
              </div>
              <div className="text-xs text-gray-500 mt-0.5">Time to First Byte</div>
            </div>

            {/* TLS */}
            <div className="p-4 rounded-xl bg-surface-1 border border-surface-2">
              <div className="text-xs text-gray-400 mb-1">{tx.tls}</div>
              {result.tls ? (
                <>
                  <div className={clsx("flex items-center gap-1.5 font-semibold", result.tls.valid ? "text-green-400" : "text-red-400")}>
                    {result.tls.valid ? <ShieldCheck className="w-4 h-4" /> : <ShieldX className="w-4 h-4" />}
                    {result.tls.valid ? tx.tlsValid : tx.tlsExpired}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 truncate">{result.tls.protocol} · {result.tls.daysRemaining}d</div>
                </>
              ) : (
                <div className="flex items-center gap-1.5 text-gray-400">
                  <ShieldOff className="w-4 h-4" />
                  <span className="font-medium">{tx.tlsNone}</span>
                </div>
              )}
            </div>
          </div>

          {/* URL info */}
          <div className="p-4 rounded-xl bg-surface-1 border border-surface-2 space-y-3">
            <div className="flex items-start gap-3 text-sm">
              <span className="text-gray-500 w-20 flex-shrink-0">{tx.finalUrl}</span>
              <span className="text-gray-200 break-all">{result.finalUrl}</span>
            </div>
            {result.ip && (
              <div className="flex items-start gap-3 text-sm">
                <span className="text-gray-500 w-20 flex-shrink-0">{tx.ip}</span>
                <span className="text-gray-200 font-mono">{result.ip}</span>
              </div>
            )}
            {result.headers["server"] && (
              <div className="flex items-start gap-3 text-sm">
                <span className="text-gray-500 w-20 flex-shrink-0">Server</span>
                <span className="text-gray-200">{result.headers["server"]}</span>
              </div>
            )}
            {result.headers["content-type"] && (
              <div className="flex items-start gap-3 text-sm">
                <span className="text-gray-500 w-20 flex-shrink-0">Content-Type</span>
                <span className="text-gray-200">{result.headers["content-type"]}</span>
              </div>
            )}
          </div>

          {/* Redirects */}
          {result.redirects.length > 0 && (
            <div className="p-4 rounded-xl bg-surface-1 border border-surface-2">
              <div className="text-sm text-gray-400 mb-3">{tx.redirects}</div>
              <div className="space-y-2">
                {result.redirects.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className={clsx("px-2 py-0.5 rounded text-xs font-mono border", statusColor(r.status))}>
                      {r.status}
                    </span>
                    <ArrowRight className="w-3 h-3 text-gray-600 flex-shrink-0" />
                    <span className="text-gray-300 break-all">{r.url}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2 text-sm">
                  <span className={clsx("px-2 py-0.5 rounded text-xs font-mono border", statusColor(result.status))}>
                    {result.status}
                  </span>
                  <ArrowRight className="w-3 h-3 text-gray-600 flex-shrink-0" />
                  <span className="text-gray-200 break-all">{result.finalUrl}</span>
                  <span className="text-xs text-gray-500 flex-shrink-0">(final)</span>
                </div>
              </div>
            </div>
          )}

          {/* TLS detail */}
          {result.tls && (
            <div className="p-4 rounded-xl bg-surface-1 border border-surface-2 space-y-2">
              <div className="text-sm text-gray-400 mb-3">{tx.tls} — {result.tls.protocol}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">{tx.tlsIssuer}: </span>
                  <span className="text-gray-200">{result.tls.issuer}</span>
                </div>
                <div>
                  <span className="text-gray-500">{tx.tlsExpiry}: </span>
                  <span className={clsx(result.tls.daysRemaining < 30 ? "text-orange-400" : "text-gray-200")}>
                    {new Date(result.tls.validTo).toLocaleDateString()} ({result.tls.daysRemaining} {tx.tlsDays})
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Subject: </span>
                  <span className="text-gray-200">{result.tls.subject}</span>
                </div>
              </div>
            </div>
          )}

          {/* Headers */}
          <div className="p-4 rounded-xl bg-surface-1 border border-surface-2">
            <button
              onClick={() => setShowHeaders(!showHeaders)}
              className="flex items-center justify-between w-full text-sm text-gray-400 hover:text-white transition-colors"
            >
              <span>{tx.headers} ({Object.keys(result.headers).length})</span>
              {showHeaders ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showHeaders && (
              <div className="mt-3 space-y-1.5">
                {Object.entries(result.headers).map(([key, val]) => (
                  <div key={key} className="flex items-start gap-3 text-xs font-mono">
                    <span className="text-violet-400 flex-shrink-0 min-w-[180px]">{key}</span>
                    <span className="text-gray-300 break-all">{val}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-1 py-8 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <img src="/logo-text.svg" alt="httping.io" className="h-5 w-auto" />
            <span className="text-gray-700">·</span>
            <span>Built for developers who care about reliability.</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noopener" className="hover:text-gray-300 transition-colors">GitHub</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
