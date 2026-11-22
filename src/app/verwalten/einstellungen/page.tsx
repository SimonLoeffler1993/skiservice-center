import { Settings } from "lucide-react";

import CheckinSchluessel from "@/components/einstellungen/CheckinSchluessel";
import EinstellungenFormular from "@/components/einstellungen/EinstellungenFormular";
import OidcHilfe from "@/components/einstellungen/OidcHilfe";
import ScannerEinrichtung from "@/components/einstellungen/ScannerEinrichtung";
import { getConfig } from "@/lib/config";
import { rechtSeite } from "@/lib/seitenschutz";

type SuchParameter = { scanner?: string | string[]; gruppe?: string | string[] };

// ?gruppe=<gruppe> öffnet einen Reiter, ?scanner=<name> belegt den Namen in "Hardware-Scanner installieren" vor
// (Link von der Scannerseite) und öffnet ohne gruppe den Reiter Hardware-Scanner
export default async function EinstellungenPage({ searchParams }: { searchParams: Promise<SuchParameter> }) {
    await rechtSeite("einstellungen.verwalten");
    const { scanner, gruppe } = await searchParams;
    const startName = typeof scanner === "string" ? scanner : "";
    const startGruppe = typeof gruppe === "string" ? gruppe : startName ? "scanner" : undefined;

    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <h1 className="text-xl font-semibold">Einstellungen</h1>
            </div>
            {/* Die Karten stehen nur im passenden Reiter */}
            <EinstellungenFormular
                startGruppe={startGruppe}
                zusatz={{
                    scanner: <ScannerEinrichtung webflasherUrl={getConfig().webflasherUrl} startName={startName} />,
                    anwendung: <CheckinSchluessel />,
                    oidc: <OidcHilfe />,
                }}
            />
        </section>
    );
}
