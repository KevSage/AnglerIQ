import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SAGE",
  description: "Seasonal Adaptive Guidance Engine for bass fishing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-US">
      <body className={`${inter.className} bg-slate-950 text-slate-50`}>
        <nav className="flex gap-6 px-6 py-3 border-b border-slate-800 bg-slate-900">
          <span className="font-semibold tracking-wide text-sky-400">SAGE</span>
          <a href="/" className="text-sm text-slate-300 hover:text-sky-300">
            Home
          </a>
          <a
            href="/pattern"
            className="text-sm text-slate-300 hover:text-sky-300"
          >
            Basic Pattern
          </a>
          <a
            href="/pattern/pro"
            className="text-sm text-slate-300 hover:text-sky-300"
          >
            Pro Pattern
          </a>
        </nav>
        {children}
      </body>
    </html>
  );
}
