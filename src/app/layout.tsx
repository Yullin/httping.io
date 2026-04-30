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
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0f]">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
