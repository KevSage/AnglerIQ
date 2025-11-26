import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SAGE Fishing Intelligence",
  description: "AI bass fishing assistant powered by the SAGE engine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 text-slate-50`}>
        <nav className="flex gap-6 px-6 py-3 border-b border-slate-800 bg-slate-900">
          <span className="font-semibold tracking-wide text-sky-400">SAGE</span>
          <Link href="/pattern" className="hover:text-sky-300">
            Pattern Assistant
          </Link>
          <Link href="/chat" className="hover:text-sky-300">
            Chat Coach
          </Link>
          <Link href="/sonar" className="hover:text-sky-300">
            Sonar Analysis
          </Link>
        </nav>
        <div>{children}</div>
      </body>
    </html>
  );
}
