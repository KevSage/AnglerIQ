import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { UserNameProvider } from "./context/UserNameContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AnglerIQ",
  description: "Pattern-first bass fishing intelligence",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserNameProvider>{children}</UserNameProvider>
      </body>
    </html>
  );
}
