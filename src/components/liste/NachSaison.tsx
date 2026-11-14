import { LISTEN_RASTER } from "@/components/liste/ListenTeile";
import { SaisonsNamen } from "@/types/saison";

export function ListeLeerText({ text }: { text: string }) {
    return <p className="rounded-lg border border-dashed p-6 text-center text-muted-foreground">{text}</p>;
}

// Einträge je Saison unter einer Überschrift. Die Reihenfolge (neueste zuerst) kommt von der API
export default function NachSaison<T>({ eintraege, saisonID, saisons, leer, karte }: {
    eintraege: T[];
    saisonID: (eintrag: T) => number | null;
    saisons: SaisonsNamen[];
    leer: string;
    karte: (eintrag: T) => React.ReactNode;
}) {
    if (eintraege.length === 0) return <ListeLeerText text={leer} />;

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
