"use client";

import { useQuery } from "@tanstack/react-query";

import DetailKopf from "@/components/detail/DetailKopf";
import { AusgemustertBadge } from "@/components/material/bearbeiten/MaterialAktionen";
import { schuhDetailsOptions } from "@/hooks/useMaterialDetailOptions";
import { SaisonsNamen } from "@/types/saison";
import ErloesKarte from "./ErloesKarte";
import MaterialVerleihListe from "./MaterialVerleihListe";

type SchuhDetailsProps = {
    schuhID: number;
    // Für die Saison-Überschriften der Verleihe
    saisons: SaisonsNamen[];
};

const ZURUECK = { zurueckHref: "/material?view=schuherstellen", zurueckText: "Schuhe" };

// Detailseite eines Leihschuhs: Erwirtschaftetes und jeder Verleih einzeln
export default function SchuhDetails({ schuhID, saisons }: SchuhDetailsProps) {
    const details = useQuery(schuhDetailsOptions(schuhID));

    if (details.isPending) return <p className="text-sm text-muted-foreground">Schuh wird geladen...</p>;
    if (details.error) {
        return (
            <div className="space-y-4">
                <DetailKopf {...ZURUECK} titel="Schuh" />
                <p className="text-sm text-destructive">{details.error.message}</p>
            </div>
        );
    }

    const { Schuh: schuh, Verleihe, Summen } = details.data;
    const unterzeile = [
        `Größe ${schuh.Groese} MP`,
        schuh.Sohle ? `Sohle ${schuh.Sohle} mm` : null,
        `Nr. ${schuh.SchuhNr}`,
        `Saison ${schuh.Saison}`,
    ].filter(Boolean).join(" · ");

    return (
        <div className="space-y-6">
            <DetailKopf
                {...ZURUECK}
                titel={`${schuh.Modell.Hersteller.Name} ${schuh.Modell.Modell}`}
                unterzeile={unterzeile}
                badges={schuh.Ausgemustert ? <AusgemustertBadge /> : undefined}
                betrag={Summen.Ergebnis}
                betragTitel="Erwirtschaftet"
            />

            <div className="grid gap-4 lg:grid-cols-2">
                <ErloesKarte
                    summen={Summen}
                    ek={schuh.EK}
                    anteilProzent={100 - details.data.AnteilSkiProzent}
                    anderesTeil="Ski"
                />
            </div>

            <section className="space-y-3">
                <h2 className="text-lg font-semibold">Verleihe ({Verleihe.length})</h2>
                <MaterialVerleihListe verleihe={Verleihe} saisons={saisons} />
            </section>
        </div>
    );
}
