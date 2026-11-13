"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

import AuftragFertigBis from "@/components/skiservice/anzeigen/AuftragFertigBis";
import { LISTEN_RASTER, ListenKarte } from "@/components/liste/ListenTeile";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { WerkstattSki } from "@/types/werkstatttypes";

type Ansicht = "alle" | "bindung" | "service";

const PILLE = "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium";

// Arbeitsliste der Werkstatt: Ski, die noch eingestellt oder bearbeitet werden müssen
export default function OffeneSkiListe({ skis }: { skis: WerkstattSki[] }) {
    const [ansicht, setAnsicht] = useState<Ansicht>("alle");

    const bindung = skis.filter((ski) => ski.bindung_offen);
    const service = skis.filter((ski) => ski.service_offen);
    const sichtbar = ansicht === "bindung" ? bindung : ansicht === "service" ? service : skis;

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

            {sichtbar.length === 0 ? (
                <div className="flex items-center gap-3 rounded-xl border border-dashed bg-muted/30 px-4 py-6 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                    <p>
                        {ansicht === "bindung"
                            ? "Keine Bindung mehr einzustellen."
                            : ansicht === "service"
                                ? "Kein Service mehr offen."
                                : "Alles erledigt, kein Ski mehr offen."}
                    </p>
                </div>
            ) : (
                <div className={LISTEN_RASTER}>
                    {sichtbar.map((ski) => (
                        <ListenKarte key={ski.ski_id} href={`/skiservice/anzeigen/${ski.auftrag_id}?ski=${ski.ski_id}`}>
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-lg font-bold tracking-tight">{ski.ski_name || ski.auftrag_name || `Ski ${ski.ski_id}`}</p>
                                <AuftragFertigBis fertigBis={ski.abhol_date} kurz className="shrink-0 text-sm text-muted-foreground" />
                            </div>
                            <p className="truncate font-semibold">{ski.kunde_name}</p>
                            <p className="truncate text-sm text-muted-foreground">{ski.service}</p>
                            {ski.komentar && <p className="line-clamp-2 text-sm italic text-muted-foreground">{ski.komentar}</p>}
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                                {ski.service_offen && (
                                    <span className={`${PILLE} bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400`}>
                                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                        Service offen
                                    </span>
                                )}
                                {ski.bindung_offen && (
                                    <span className={`${PILLE} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`}>
                                        <span className="h-1.5 w-1.5 rounded-full bg-red-500 dark:bg-red-400" />
                                        Bindung einstellen
                                    </span>
                                )}
                            </div>
                        </ListenKarte>
                    ))}
                </div>
            )}
        </section>
    );
}
