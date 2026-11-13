"use client";

import { useState } from "react";

import AuftragFertigBis from "@/components/skiservice/anzeigen/AuftragFertigBis";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { WerkstattSki } from "@/types/werkstatttypes";
import WerkstattZeile, { WerkstattErledigt, WerkstattListe } from "./WerkstattZeile";

type Ansicht = "alle" | "bindung" | "service";

type AuftragZeile = {
    auftrag_id: number;
    nummer: string;
    kunde_name: string;
    abhol_date?: string | null;
    // Offene Ski des Auftrags
    ski: number;
    // Offene Leistungen mit Anzahl, z.B. "großer Service" -> 2
    leistungen: Map<string, number>;
    // Ski, deren Bindung noch eingestellt werden muss
    bindung: number;
};

// Ski je Auftrag zusammenfassen, die Reihenfolge der API (dringendste zuerst) bleibt
function jeAuftrag(skis: WerkstattSki[]): AuftragZeile[] {
    const auftraege = new Map<number, AuftragZeile>();
    for (const ski of skis) {
        let zeile = auftraege.get(ski.auftrag_id);
        if (!zeile) {
            zeile = {
                auftrag_id: ski.auftrag_id,
                nummer: ski.auftrag_name || `Nr. ${ski.auftrag_id}`,
                kunde_name: ski.kunde_name,
                abhol_date: ski.abhol_date,
                ski: 0,
                leistungen: new Map(),
                bindung: 0,
            };
            auftraege.set(ski.auftrag_id, zeile);
        }
        zeile.ski += 1;
        if (ski.service_offen) zeile.leistungen.set(ski.service, (zeile.leistungen.get(ski.service) ?? 0) + 1);
        if (ski.bindung_offen) zeile.bindung += 1;
    }
    return [...auftraege.values()];
}

// Arbeitsliste der Werkstatt: je Auftrag eine Zeile mit Nummer, Name, Anzahl der offenen Ski
// und darunter, was noch zu machen ist (Leistungen und Bindung)
export default function OffeneSkiListe({ skis }: { skis: WerkstattSki[] }) {
    const [ansicht, setAnsicht] = useState<Ansicht>("alle");

    const bindung = skis.filter((ski) => ski.bindung_offen);
    const service = skis.filter((ski) => ski.service_offen);
    const zeilen = jeAuftrag(ansicht === "bindung" ? bindung : ansicht === "service" ? service : skis);

    return (
        <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Noch zu tun</h2>
                <Tabs value={ansicht} onValueChange={(wert) => setAnsicht(wert as Ansicht)}>
                    <TabsList className="h-10">
                        <TabsTrigger value="alle" className="px-3">Alle ({skis.length})</TabsTrigger>
                        <TabsTrigger value="bindung" className="px-3">Einstellen ({bindung.length})</TabsTrigger>
                        <TabsTrigger value="service" className="px-3">Service ({service.length})</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {zeilen.length === 0 ? (
                <WerkstattErledigt
                    text={ansicht === "bindung"
                        ? "Keine Bindung mehr einzustellen."
                        : ansicht === "service"
                            ? "Kein Service mehr offen."
                            : "Alles erledigt, kein Ski mehr offen."}
                />
            ) : (
                <WerkstattListe>
                    {zeilen.map((zeile) => {
                        // Im Tab "Einstellen" nur die Bindung, im Tab "Service" nur die Leistungen
                        const leistungen = ansicht === "bindung" ? [] : [...zeile.leistungen];
                        const bindungen = ansicht === "service" ? 0 : zeile.bindung;
                        return (
                            <WerkstattZeile
                                key={zeile.auftrag_id}
                                href={`/skiservice/anzeigen/${zeile.auftrag_id}`}
                                nummer={zeile.nummer}
                                name={zeile.kunde_name}
                                detail={
                                    <>
                                        {leistungen.length > 0 && (
                                            <span>{leistungen.map(([name, anzahl]) => `${anzahl}× ${name}`).join(" · ")}</span>
                                        )}
                                        {bindungen > 0 && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2 py-px font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                                <span className="h-1.5 w-1.5 rounded-full bg-red-500 dark:bg-red-400" />
                                                {bindungen}× Bindung
                                            </span>
                                        )}
                                    </>
                                }
                                zusatz={zeile.abhol_date && <AuftragFertigBis fertigBis={zeile.abhol_date} kurz />}
                                anzahl={`${zeile.ski} Ski`}
                            />
                        );
                    })}
                </WerkstattListe>
            )}
        </section>
    );
}
