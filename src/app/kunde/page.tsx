import { redirect } from "next/navigation";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import KundenListe from "@/components/kunde/liste/KundenListe";
import { kundenUrl } from "@/components/kunde/liste/kundenUrl";
import { kundenListeOptions } from "@/hooks/useKundeOptions";
import { KundenSortierungSchema } from "@/types/skikundentypes";

type KundenSeiteProps = {
    searchParams: Promise<{ suche?: string | string[]; sortierung?: string | string[]; seite?: string | string[] }>;
};

export default async function KundenSeite({ searchParams }: KundenSeiteProps) {
    const parameter = await searchParams;
    // Ungültige Werte gelten als Standard
    const suche = typeof parameter.suche === "string" ? parameter.suche.trim().slice(0, 100) : "";
    const sortierung = KundenSortierungSchema.safeParse(parameter.sortierung).data ?? "name";
    const seitenzahl = typeof parameter.seite === "string" && /^\d{1,6}$/.test(parameter.seite) ? parseInt(parameter.seite) : 1;
    const seite = Math.max(1, seitenzahl);

    // Erste Anzeige kommt fertig vom Server
    const queryClient = new QueryClient();
    const optionen = kundenListeOptions(seite, sortierung, suche);
    await queryClient.prefetchQuery(optionen);

    // Seite hinter dem Ende (z.B. alter Link): auf die letzte vorhandene
    const daten = queryClient.getQueryData(optionen.queryKey);
    if (daten) {
        const seiten = Math.max(1, Math.ceil(daten.gesamt / daten.proSeite));
        if (seite > seiten) redirect(kundenUrl({ suche, sortierung, seite: seiten }));
    }

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Kunden</h1>
                <p className="text-muted-foreground">Kunde auswählen, um ihn zu bearbeiten und seine Aufträge, Verleihe und Quittungen zu sehen.</p>
            </div>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <KundenListe suche={suche} sortierung={sortierung} seite={seite} />
            </HydrationBoundary>
        </div>
    );
}
