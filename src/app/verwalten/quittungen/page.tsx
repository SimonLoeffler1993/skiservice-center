import { Suspense } from "react";
import { Receipt } from "lucide-react";

import BackendFehler from "@/components/saison/BackendFehler";
import KeineSaison from "@/components/saison/KeineSaison";
import SaisonWechseler from "@/components/saisonverleih/liste/SaisonWechseler";
import QuittungenListe from "@/components/quittung/QuittungenListe";
import { getSaisonDaten } from "@/lib/saisonactions";

type QuittungenSeiteProps = {
    searchParams: Promise<{ saison?: string }>;
};

export default async function QuittungenSeite({ searchParams }: QuittungenSeiteProps) {
    const saisonDaten = await getSaisonDaten();
    if (!saisonDaten.success) {
        return <BackendFehler meldung={saisonDaten.error} />;
    }

    // Saison aus URL, sonst die aktuelle
    const { saison } = await searchParams;
    const saisonID = saison ? parseInt(saison) : saisonDaten.data.aktuelle?.ID;
    if (!saisonID || Number.isNaN(saisonID)) {
        return <KeineSaison />;
    }

    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-muted-foreground" />
                <h1 className="text-xl font-semibold">Quittungen</h1>
            </div>
            <Suspense fallback={<div>Lade Saisons...</div>}>
                <SaisonWechseler saisons={saisonDaten.data.saisons} selectedSaisonID={saisonID} />
            </Suspense>
            <QuittungenListe saisonID={saisonID} />
        </section>
    );
}
