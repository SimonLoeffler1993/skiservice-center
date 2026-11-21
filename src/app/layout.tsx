import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { connection } from "next/server";
import { Providers } from "./providers";
import { getConfig } from "@/lib/config";
import { holeIch, holeStatus } from "@/lib/anmeldungactions";
import { leseTokens } from "@/lib/sitzung";

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
  // Angemeldeter Bediener und Gerät für Menü, Rechte und Inaktivität
  const [ich, tokens, status] = await Promise.all([holeIch(), leseTokens(), holeStatus()]);
  // Rechte ohne Anmeldung (Gruppe "Ohne Anmeldung"); API nicht erreichbar: alles zeigen, die API prüft selbst
  const gastRechte = status.success ? status.data.ohne_anmeldung.rechte : ["*"];
  // Cookies da, aber die API kennt die Sitzung nicht mehr: der Browser geht zur Anmeldung bzw. Bedienerauswahl
  const sitzung = { geraet: Boolean(tokens.geraet), bediener: Boolean(tokens.bediener) };

  return (
    <html lang="de">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Providers backendUrl={backendUrl} ich={ich} sitzung={sitzung} gastRechte={gastRechte}>
          {children}
          </Providers>
      </body>
    </html>
  );
}
