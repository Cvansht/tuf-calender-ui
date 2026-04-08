import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-serif"
});

const sans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: "Wall Calendar Challenge",
  description: "Interactive wall calendar with range selection and notes."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${serif.variable} ${sans.variable} min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.92),transparent_38%),linear-gradient(180deg,#f4f0ea_0%,#e8e3db_100%)] font-sans text-slate-900 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
