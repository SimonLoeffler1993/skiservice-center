import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  // Die Seite "Fertigstellen" heißt jetzt "Scanner", alte Links und Lesezeichen weiterleiten
  async redirects() {
    return [{ source: "/fertig", destination: "/scanner", permanent: true }];
  },
};

export default nextConfig;
