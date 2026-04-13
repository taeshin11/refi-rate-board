import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RefiRateBoard — Today's Refinance Rates",
  description: "Compare refinance rates from top lenders. Current 30-year, 15-year, cash-out, and VA refi rates updated daily.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
