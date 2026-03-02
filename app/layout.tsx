import "./globals.css";
import Link from "next/link";
import { ReactNode } from "react";

export const metadata = {
  title: "PilotPay Guardian",
  description: "Reserve reassignment legality and pay protection analyzer",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
            <h1 className="font-semibold">PilotPay Guardian</h1>
            <nav className="flex gap-4 text-sm">
              <Link href="/">Analyze</Link>
              <Link href="/history">History</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-4xl p-4 md:p-6">{children}</main>
      </body>
    </html>
  );
}
