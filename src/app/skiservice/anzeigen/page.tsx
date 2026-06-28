import SaisonWechseler from "@/components/saisonverleih/liste/SaisonWechseler";
import { serviceListeOptions } from "@/hooks/useServiceListeOptions";
import { getAktuelleSaisonID, getSaisons } from "@/lib/saisonactions";
import { QueryClient } from "@tanstack/react-query";
import { Snowflake } from "lucide-react";
import { Suspense } from "react";

type SkiservicesAnzeigenProps = {
    searchParams: Promise<{ saison?: string }>
}

export default async function SkiservicesAnzeigen({ searchParams }: SkiservicesAnzeigenProps) {

    // Daten für den Saisonwechsler laden
    const saisonData = await getSaisons();
    const { saison } = await searchParams;

    // atuelle Saison
    let saisonID: number | undefined

    // Saison aus URL, falls nicht vorhanden wird die aktuelle ermittelt
    if (!saison) {
        const aktuelleSaison = await getAktuelleSaisonID()
        if (aktuelleSaison) {
            saisonID = aktuelleSaison.ID
        }
    } else {
        saisonID = parseInt(saison)
    }

    // Fehler falls keine Saison gibt
    if (!saisonID) {
        return <p>Keine Saison gefunden!</p>
    }

    // Service in Cache laden
    const queryClient = new QueryClient();
    await queryClient.prefetchInfiniteQuery(serviceListeOptions(saisonID))

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Snowflake className="h-5 w-5 text-muted-foreground" />
                    <h1 className="text-xl font-semibold">Skiservice</h1>
                </div>
            </div>
            <Suspense fallback={<div>Lade Skiservices ...</div>}>
                <SaisonWechseler saisons={saisonData} selectedSaisonID={saisonID} />
            </Suspense>

        </section>
    )
}