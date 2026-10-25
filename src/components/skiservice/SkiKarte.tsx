"use client";

import { MessageSquare, Ruler, ScanLine } from "lucide-react";

import { HERVORGEHOBEN_KLASSE, useHervorheben } from "@/hooks/useHervorheben";
import { cn, euro } from "@/lib/utils";
import { bindungsdatenText } from "@/types/bindungsdatentypes";
import { Auftrag, Ski } from "@/types/skiservicetypes";
import SkiAktionen from "./bearbeiten/SkiAktionen";
import BindungsdatenDialog from "./bindung/BindungsdatenDialog";
import SkiBindung from "./SkiBindung";
import SkiBindungPruefenButton from "./SkiBindungPruefenButton";
import SkiStatus from "./SkiStatus";

type SkiKarteProps = {
    ski: Ski;
    auftrag: Auftrag;
    bezahlt: boolean;
    letzterSki: boolean;
    // Per QR-Code aufgerufen: hervorheben und hinscrollen
    hervorgehoben?: boolean;
};

// Ein Ski in der Auftrags-Detailansicht: Service und Preis, Status, Bindung und Aktionen
export default function SkiKarte({ ski, auftrag, bezahlt, letzterSki, hervorgehoben = false }: SkiKarteProps) {
    const ref = useHervorheben<HTMLElement>(hervorgehoben);
    const preis = ski.preis + (ski.bindung_check ? ski.bindung_preis : 0);
    const bindungText = ski.bindung_check ? bindungsdatenText(ski.bindungsdaten) : null;

    return (
        <article ref={ref} className={cn("flex flex-col rounded-xl border bg-card", hervorgehoben && HERVORGEHOBEN_KLASSE)}>
            <div className="flex items-start justify-between gap-3 border-b px-4 py-3">
                <div className="min-w-0">
                    <p className="truncate font-semibold">{ski.name || `Ski #${ski.id}`}</p>
                    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                        {ski.service}
                        {hervorgehoben && (
                            <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-primary px-1.5 py-0.5 text-xs font-medium text-primary-foreground">
                                <ScanLine className="h-3 w-3" />
                                Gescannt
                            </span>
                        )}
                    </p>
                </div>
                <div className="-my-1 -mr-2 flex shrink-0 items-center gap-1">
                    <span className="mr-1 font-semibold tabular-nums">{euro.format(preis)}</span>
                    <SkiAktionen ski={ski} auftrag={auftrag} bezahlt={bezahlt} letzterSki={letzterSki} kundeId={auftrag.kunden_id} />
                </div>
            </div>

            <div className="flex-1 space-y-3 px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                    <SkiStatus status={ski.status} />
                    <SkiBindung BindungCheck={ski.bindung_check} BindungStatus={ski.bindung_status} />
                </div>
                {bindungText && (
                    <p className="flex items-start gap-3 rounded-md bg-muted/60 px-2 py-1.5 text-sm" title="Bindungsdaten">
                        <Ruler className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        {bindungText}
                    </p>
                )}
                {ski.komentar && (
                    <p className="flex items-start gap-3 text-sm" title="Kommentar">
                        <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="whitespace-pre-line">{ski.komentar}</span>
                    </p>
                )}
            </div>

            {ski.bindung_check && (
                <div className="flex flex-wrap items-center gap-2 border-t px-4 py-3 [&_button]:h-9">
                    <BindungsdatenDialog ski={ski} kundeId={auftrag.kunden_id} />
                    <SkiBindungPruefenButton skiid={ski.id} auftragid={ski.auftrag_id} Check={ski.bindung_check} Status={ski.bindung_status} />
                </div>
            )}
        </article>
    );
}
