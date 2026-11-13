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
    service: number;
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
                service: 0,
                bindung: 0,
            };
            auftraege.set(ski.auftrag_id, zeile);
        }
        zeile.ski += 1;
        if (ski.service_offen) zeile.service += 1;
        if (ski.bindung_offen) zeile.bindung += 1;
    }
    return [...auftraege.values()];
}

// Arbeitsliste der Werkstatt: je Auftrag eine Zeile mit Nummer, Name und Anzahl der offenen Ski
export default function OffeneSkiListe({ skis }: { skis: WerkstattSki[] }) {
    const [ansicht, setAnsicht] = useState<Ansicht>("alle");

    const bindung = skis.filter((ski) => ski.bindung_offen);
    const service = skis.filter((ski) => ski.service_offen);
    const zeilen = jeAuftrag(ansicht === "bindung" ? bindung : ansicht === "service" ? service : skis);

    return (
        <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Skiservice: noch zu tun</h2>
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
                    {zeilen.map((zeile) => (
                        <WerkstattZeile
                            key={zeile.auftrag_id}
                            href={`/skiservice/anzeigen/${zeile.auftrag_id}`}
                            nummer={zeile.nummer}
                            name={zeile.kunde_name}
                            zusatz={
                                <>
                                    {/* Unter "Alle" zeigen, was am Auftrag offen ist */}
                                    {ansicht === "alle" && zeile.bindung > 0 && (
                                        <span className="mr-3">
                                            {zeile.service > 0 ? `${zeile.service} Service · ${zeile.bindung} Bindung` : "nur Bindung"}
                                        </span>
                                    )}
                                    {zeile.abhol_date && <AuftragFertigBis fertigBis={zeile.abhol_date} kurz />}
                                </>
                            }
                            anzahl={`${zeile.ski} Ski`}
                        />
                    ))}
                </WerkstattListe>
            )}
        </section>
    );
}
