import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { connection } from "next/server";
import { Providers } from "./providers";
import { getConfig } from "@/lib/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skiservice Center",
  description: "Simons SKiservice Center",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Zur Laufzeit lesen (Docker), nicht beim Build
  await connection();
  const { backendUrl } = getConfig();

  return (
    <html lang="de">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Providers backendUrl={backendUrl}>
          {children}
          </Providers>
      </body>
    </html>
  );
}
