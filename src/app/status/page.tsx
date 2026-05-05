import Link from "next/link";
import { Globe } from "lucide-react";
import { STATUS_DB } from "./status-db";

const CATEGORY_META: Record<string, { label: string; labelZh: string; emoji: string }> = {
  "1xx": { label: "Informational", labelZh: "信息响应", emoji: "💡" },
  "2xx": { label: "Success", labelZh: "成功响应", emoji: "✅" },
  "3xx": { label: "Redirection", labelZh: "重定向", emoji: "🔀" },
  "4xx": { label: "Client Error", labelZh: "客户端错误", emoji: "⚠️" },
  "5xx": { label: "Server Error", labelZh: "服务器错误", emoji: "💥" },
};

const CATEGORY_COLOR: Record<string, string> = {
  "1xx": "text-blue-400 bg-blue-400/10 border-blue-400/20 hover:bg-blue-400/20",
  "2xx": "text-green-400 bg-green-400/10 border-green-400/20 hover:bg-green-400/20",
  "3xx": "text-yellow-400 bg-yellow-400/10 border-yellow-400/20 hover:bg-yellow-400/20",
  "4xx": "text-orange-400 bg-orange-400/10 border-orange-400/20 hover:bg-orange-400/20",
  "5xx": "text-red-400 bg-red-400/10 border-red-400/20 hover:bg-red-400/20",
};

export const metadata = {
  title: "HTTP Status Codes List — httping.io",
  description: "Complete list of all HTTP status codes — 1xx Informational, 2xx Success, 3xx Redirection, 4xx Client Error, 5xx Server Error. With examples and use cases.",
};

export default function StatusIndexPage() {
  // Group by category
  const grouped: Record<string, typeof STATUS_DB[keyof typeof STATUS_DB][]> = {};
  Object.values(STATUS_DB).forEach((info) => {
    if (!grouped[info.category]) grouped[info.category] = [];
    grouped[info.category].push(info);
  });

  const categories = ["1xx", "2xx", "3xx", "4xx", "5xx"] as const;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Nav */}
      <nav className="border-b border-white/5 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
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

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
            HTTP Status Codes
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Complete reference of all HTTP status codes. Click any code to learn what it means, when it occurs, and how to handle it.
          </p>
        </div>

        {/* Category sections */}
        {categories.map((cat) => {
          const codes = grouped[cat] || [];
          const meta = CATEGORY_META[cat];
          return (
            <section key={cat} className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{meta.emoji}</span>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {cat} {meta.label}
                  </h2>
                  <p className="text-sm text-gray-500">{meta.labelZh}</p>
                </div>
                <span className="ml-auto text-xs text-gray-600">
                  {codes.length} codes
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {codes.map((info) => (
                  <Link
                    key={info.code}
                    href={`/status/${info.code}`}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${CATEGORY_COLOR[cat]}`}
                  >
                    <span className="font-mono font-bold text-lg shrink-0 w-12">
                      {info.code}
                    </span>
                    <div className="min-w-0">
                      <div className="font-medium text-sm text-white truncate">
                        {info.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                        {info.summary}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        {/* CTA */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20 text-center">
          <h2 className="text-lg font-bold text-white mb-2">Check any URL in real-time</h2>
          <p className="text-gray-400 text-sm mb-4">
            Use our HTTP ping tool to instantly check status codes, response time, TTFB, and more.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Globe className="w-4 h-4" />
            Try httping.io →
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 mt-12">
        <div className="max-w-5xl mx-auto text-center text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-300 transition-colors">httping.io</Link>
          {" · "}Built for developers who care about reliability.
          {" · "}
          <Link href="/status" className="hover:text-gray-300 transition-colors">All Status Codes</Link>
        </div>
      </footer>
    </div>
  );
}
