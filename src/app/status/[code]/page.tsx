import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Globe } from "lucide-react";
import { STATUS_DB, type StatusInfo } from "../status-db";
import clsx from "clsx";

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
                {info.useCases.map((uc: string, i: number) => (
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
                        CATEGORY_COLOR[r.category]
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
