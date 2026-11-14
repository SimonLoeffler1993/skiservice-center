import { Settings } from "lucide-react";

import CheckinSchluessel from "@/components/einstellungen/CheckinSchluessel";
import EinstellungenFormular from "@/components/einstellungen/EinstellungenFormular";
import ScannerEinrichtung from "@/components/einstellungen/ScannerEinrichtung";
import { getConfig } from "@/lib/config";

// ?scanner=<name> belegt den Namen in "Hardware-Scanner installieren" vor (Link von der Scannerseite)
export default async function EinstellungenPage({ searchParams }: { searchParams: Promise<{ scanner?: string | string[] }> }) {
    const { scanner } = await searchParams;

    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <h1 className="text-xl font-semibold">Einstellungen</h1>
            </div>
            <EinstellungenFormular />
            <ScannerEinrichtung webflasherUrl={getConfig().webflasherUrl} startName={typeof scanner === "string" ? scanner : ""} />
            <CheckinSchluessel />
        </section>
    );
}
