import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Analytics from "@/components/Analytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "httping.io — HTTP Ping & Diagnostics Tool",
  description: "Instantly check HTTP status, response time, TTFB, redirect chains and TLS certificates for any URL. Free online HTTP diagnostic tool for developers.",
  keywords: ["HTTP check", "HTTP ping", "URL checker", "response time", "TTFB", "TLS check", "HTTP status code", "redirect checker"],
  authors: [{ name: "httping.io" }],
  metadataBase: new URL("https://httping.io"),
  openGraph: {
    title: "httping.io — HTTP Ping & Diagnostics Tool",
    description: "Instantly check HTTP status, response time, TTFB, redirect chains and TLS certificates for any URL.",
    url: "https://httping.io",
    siteName: "httping.io",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "httping.io — HTTP Ping & Diagnostics Tool",
    description: "Instantly check HTTP status, response time, TTFB, redirect chains and TLS certificates for any URL.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "httping.io",
    url: "https://www.httping.io",
    description: "Free online HTTP ping and diagnostics tool. Check HTTP status codes, response time, TTFB, redirect chains and TLS certificates for any URL.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    creator: {
      "@type": "Organization",
      name: "httping.io",
      url: "https://www.httping.io",
    },
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#0a0a0f]">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
