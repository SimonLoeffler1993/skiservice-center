"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import DetailKopf from "@/components/detail/DetailKopf";
import { AusgemustertBadge } from "@/components/material/bearbeiten/MaterialAktionen";
import { skiDetailsOptions } from "@/hooks/useMaterialDetailOptions";
import { SaisonsNamen } from "@/types/saison";
import ErloesKarte from "./ErloesKarte";
import MaterialVerleihListe from "./MaterialVerleihListe";
import SkiServiceKarte from "./SkiServiceKarte";

type SkiDetailsProps = {
    skiID: number;
    // Für die Saison-Überschriften der Verleihe
    saisons: SaisonsNamen[];
};

const ZURUECK = { zurueckHref: "/material?view=skierstellen", zurueckText: "Ski" };

// Detailseite eines Leihskis: Erwirtschaftetes, Services und jeder Verleih einzeln
export default function SkiDetails({ skiID, saisons }: SkiDetailsProps) {
    const queryClient = useQueryClient();
    const details = useQuery(skiDetailsOptions(skiID));

    if (details.isPending) return <p className="text-sm text-muted-foreground">Ski wird geladen...</p>;
    if (details.error) {
        return (
            <div className="space-y-4">
                <DetailKopf {...ZURUECK} titel="Ski" />
                <p className="text-sm text-destructive">{details.error.message}</p>
            </div>
        );
    }

    const { Ski: ski, Verleihe, Services, Summen } = details.data;

    return (
        <div className="space-y-6">
            <DetailKopf
                {...ZURUECK}
                titel={`${ski.Modell.Hersteller.Name} ${ski.Modell.Modell}`}
                unterzeile={`${ski.Laenge} cm · ${ski.Modell.Art.Art} · Nr. ${ski.SkiNr} · Saison ${ski.Saison}`}
                badges={ski.Ausgemustert ? <AusgemustertBadge /> : undefined}
                betrag={Summen.Ergebnis}
                betragTitel="Erwirtschaftet"
            />

            <div className="grid gap-4 lg:grid-cols-2">
                <ErloesKarte
                    summen={Summen}
                    anzahlServices={Services.length}
                    ek={ski.EK}
                    anteilProzent={details.data.AnteilSkiProzent}
                    anderesTeil="Schuh"
                />
                <SkiServiceKarte
                    skiID={ski.ID}
                    services={Services}
                    abzugStandard={details.data.ServiceAbzugStandard}
                    onGeaendert={() => queryClient.invalidateQueries({ queryKey: skiDetailsOptions(skiID).queryKey })}
                />
            </div>

            <section className="space-y-3">
                <h2 className="text-lg font-semibold">Verleihe ({Verleihe.length})</h2>
                <MaterialVerleihListe verleihe={Verleihe} saisons={saisons} />
            </section>
        </div>
    );
}
