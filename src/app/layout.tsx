import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Räkningar",
  description: "Hushållets räkningar och inkomster",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="sv" className="h-full antialiased">
      <body className="min-h-full bg-slate-50 text-slate-900">
        <div className="mx-auto min-h-full max-w-md px-4 pb-16 pt-6">{children}</div>
      </body>
    </html>
  );
}
