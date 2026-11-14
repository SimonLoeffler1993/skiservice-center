"use client";

import { useQuery } from "@tanstack/react-query";

import DetailKopf from "@/components/detail/DetailKopf";
import { LISTEN_RASTER, ListenSkeleton } from "@/components/liste/ListenTeile";
import { QuittungenTabelle } from "@/components/quittung/QuittungenListe";
import SaisonverleihListeCard from "@/components/saisonverleih/liste/SaisonverleihListeCard";
import AuftragKurzCard from "@/components/skiservice/anzeigen/AuftragKurzCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useKundeGeaendert } from "@/hooks/useKundeGeaendert";
import { kundeHistorieOptions, kundeOptions } from "@/hooks/useKundeOptions";
import { SaisonsNamen } from "@/types/saison";
import KundeForm from "./KundeForm";

type KundeDetailsProps = {
    kundeID: number;
    // Für die Saison-Überschriften in der Historie
    saisons: SaisonsNamen[];
};

function Leer({ text }: { text: string }) {
    return <p className="rounded-lg border border-dashed p-6 text-center text-muted-foreground">{text}</p>;
}

// Einträge je Saison unter einer Überschrift. Die Reihenfolge (neueste zuerst) kommt von der API
function NachSaison<T>({ eintraege, saisonID, saisons, leer, karte }: {
    eintraege: T[];
    saisonID: (eintrag: T) => number | null;
    saisons: SaisonsNamen[];
    leer: string;
    karte: (eintrag: T) => React.ReactNode;
}) {
    if (eintraege.length === 0) return <Leer text={leer} />;

    const gruppen = new Map<number | null, T[]>();
    for (const eintrag of eintraege) {
        const id = saisonID(eintrag);
        gruppen.set(id, [...(gruppen.get(id) ?? []), eintrag]);
    }

    return (
        <div className="space-y-6">
            {[...gruppen].map(([id, liste]) => (
                <section key={id ?? "ohne"} className="space-y-3">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        {id === null ? "Ohne Saison" : `Saison ${saisons.find((saison) => saison.ID === id)?.Name ?? `#${id}`}`} ({liste.length})
                    </h2>
                    <div className={LISTEN_RASTER}>{liste.map(karte)}</div>
                </section>
            ))}
        </div>
    );
}

// Kundenseite: Kunde bearbeiten, darunter seine Aufträge, Verleihe und Quittungen über alle Saisons
export default function KundeDetails({ kundeID, saisons }: KundeDetailsProps) {
    const kunde = useQuery(kundeOptions(kundeID));
    const historie = useQuery(kundeHistorieOptions(kundeID));
    const kundeGeaendert = useKundeGeaendert();

    if (kunde.isPending) return <p className="text-sm text-muted-foreground">Kunde wird geladen...</p>;
    if (kunde.error) {
        return (
            <div className="space-y-4">
                <DetailKopf zurueckHref="/kunde" zurueckText="Kunden" titel="Kunde" />
                <p className="text-sm text-destructive">{kunde.error.message}</p>
            </div>
        );
    }

    const name = [kunde.data.Vorname, kunde.data.Nachname].filter((teil) => teil?.trim()).join(" ") || "Ohne Namen";
    const anzahl = (liste: unknown[] | undefined) => (liste ? ` (${liste.length})` : "");

    return (
        <div className="space-y-6">
            <DetailKopf zurueckHref="/kunde" zurueckText="Kunden" titel={name} />
            <KundeForm kunde={kunde.data} onGeaendert={kundeGeaendert} />

            <Tabs defaultValue="skiservice" className="w-full">
                <TabsList>
                    <TabsTrigger value="skiservice">Skiservice{anzahl(historie.data?.auftraege)}</TabsTrigger>
                    <TabsTrigger value="verleih">Verleih{anzahl(historie.data?.verleihe)}</TabsTrigger>
                    <TabsTrigger value="quittungen">Quittungen{anzahl(historie.data?.quittungen)}</TabsTrigger>
                </TabsList>

                {historie.isPending ? (
                    <div className="mt-4"><ListenSkeleton /></div>
                ) : historie.error ? (
                    <p className="mt-4 text-sm text-destructive">{historie.error.message}</p>
                ) : (
                    <>
                        {historie.data.unlesbar > 0 && (
                            <p className="mt-4 text-sm text-amber-700">
                                {historie.data.unlesbar} {historie.data.unlesbar === 1 ? "alter Eintrag konnte" : "alte Einträge konnten"} nicht gelesen werden und {historie.data.unlesbar === 1 ? "fehlt" : "fehlen"} hier.
                            </p>
                        )}
                        <TabsContent value="skiservice" className="mt-4">
                            <NachSaison
                                eintraege={historie.data.auftraege}
                                // Die Saison steht beim Auftrag als Text
                                saisonID={(auftrag) => (/^\d+$/.test(auftrag.zu) ? Number(auftrag.zu) : null)}
                                saisons={saisons}
                                leer="Noch kein Skiservice."
                                karte={(auftrag) => <AuftragKurzCard key={auftrag.id} skiserviceAuftrag={auftrag} />}
                            />
                        </TabsContent>
                        <TabsContent value="verleih" className="mt-4">
                            <NachSaison
                                eintraege={historie.data.verleihe}
                                saisonID={(verleih) => verleih.Saison_ID}
                                saisons={saisons}
                                leer="Noch kein Verleih."
                                karte={(verleih) => <SaisonverleihListeCard key={verleih.ID} saisonverleih={verleih} />}
                            />
                        </TabsContent>
                        <TabsContent value="quittungen" className="mt-4">
                            {historie.data.quittungen.length === 0 ? (
                                <Leer text="Noch keine Quittung." />
                            ) : (
                                <QuittungenTabelle quittungen={historie.data.quittungen} />
                            )}
                        </TabsContent>
                    </>
                )}
            </Tabs>
        </div>
    );
}
