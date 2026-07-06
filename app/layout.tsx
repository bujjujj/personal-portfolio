import type { Metadata } from "next";
import { Abril_Fatface, Unna } from "next/font/google";
import "./globals.css";

const abril = Abril_Fatface({ 
  weight: "400", 
  subsets: ["latin"],
  variable: "--font-abril" 
});

const unna = Unna({ 
  weight: ["400", "700"], 
  subsets: ["latin"],
  variable: "--font-unna" 
});

export const metadata: Metadata = {
  title: "Chris Zhang",
  description: "Portfolio of Chris Zhang",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${abril.variable} ${unna.variable}`}>
      <body className="font-sans bg-[#FAF9F6] min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}