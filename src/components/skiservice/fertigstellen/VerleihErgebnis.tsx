"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, Check, ExternalLink, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import SaisonverleihCardStatus, { STATUS_ANZEIGE } from "@/components/saisonverleih/liste/SaisonverleihCardStatus";
import VerleihArtBadge from "@/components/saisonverleih/liste/VerleihArtBadge";
import { useVerleihAktualisieren } from "@/components/saisonverleih/bearbeiten/useVerleihAktualisieren";
import { saisonverleihDetailsOptions } from "@/hooks/useSaisonverleihDetailOptions";
import { pruefeVerleihBindungen } from "@/lib/bearbeitenactions";
import { cn } from "@/lib/utils";
import { MaterialRead } from "@/types/materialtypes";
import ScanMeldung, { Meldung } from "./ScanMeldung";

type VerleihErgebnisProps = {
    verleihId: number;
    // Gescannte Materialzeile, ist vorausgewählt
    materialId: number | null;
    // Weitere Buttons in der Aktionsleiste, z.B. "Nächsten scannen"
    zusatz?: React.ReactNode;
};

function materialName(material: MaterialRead) {
    return material.SkiFahrerName || `Ausrüstung #${material.ID}`;
}

// Gescannter Verleih: Kopf mit Kunde und Status, Material mit Ski zum Auswählen, "Bindung geprüft"
// Wird pro Scan neu eingehängt (key), damit die Auswahl zurückgesetzt wird
export default function VerleihErgebnis({ verleihId, materialId, zusatz }: VerleihErgebnisProps) {
    const { data: verleih, isPending, error } = useQuery({ ...saisonverleihDetailsOptions(verleihId), staleTime: 0 });
    const [ausgewaehlt, setAusgewaehlt] = useState<number[]>(materialId ? [materialId] : []);
    const [meldung, setMeldung] = useState<Meldung | null>(null);
    const [laeuft, startTransition] = useTransition();
    const aktualisieren = useVerleihAktualisieren(verleihId);

    if (isPending) {
        return (
            <p className="flex items-center gap-2 rounded-xl border p-6 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Verleih wird geladen...
            </p>
        );
    }
    if (error || !verleih) {
        return <ScanMeldung meldung={{ ok: false, text: error?.message ?? `Verleih ${verleihId} nicht gefunden` }} />;
    }

    const material = verleih.Material ?? [];
    // Nur ungeprüfte Ski können ausgewählt werden
    const offen = ausgewaehlt.filter((id) => material.some((m) => m.ID === id && m.Ski && !m.BindungGeprueft));
    const kunde = verleih.Kunde;

    function umschalten(m: MaterialRead) {
        if (!m.Ski || m.BindungGeprueft) return;
        setAusgewaehlt((liste) => (liste.includes(m.ID) ? liste.filter((x) => x !== m.ID) : [...liste, m.ID]));
    }

    function bindungGeprueft() {
        const statusVorher = verleih!.Status;
        startTransition(async () => {
            const antwort = await pruefeVerleihBindungen(verleihId, offen);
            if (!antwort.success) {
                setMeldung({ ok: false, text: antwort.error });
                return;
            }
            aktualisieren(antwort.data);
            setAusgewaehlt([]);
            const wechsel = antwort.data.Status !== statusVorher ? ` · Verleih ist jetzt „${STATUS_ANZEIGE[antwort.data.Status].text}“` : "";
            setMeldung({ ok: true, text: `${offen.length === 1 ? "Bindung" : `${offen.length} Bindungen`} geprüft${wechsel}` });
        });
    }

    return (
        <div className="space-y-4">
            <section className="flex flex-wrap items-start justify-between gap-3 rounded-xl border bg-card p-4 sm:p-5">
                <div className="min-w-0 space-y-1.5">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Verleih</p>
                    <p className="text-2xl font-bold tracking-tight">{verleih.Name}</p>
                    <p className="text-muted-foreground">
                        {[kunde.Vorname, kunde.Nachname].filter(Boolean).join(" ")}
                        {kunde.Handy || kunde.Tel ? ` · ${kunde.Handy || kunde.Tel}` : ""}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <VerleihArtBadge art={verleih.Art} startAm={verleih.Start_Am} endeAm={verleih.Ende_Am} />
                        <SaisonverleihCardStatus status={verleih.Status} />
                    </div>
                </div>
                <Button asChild variant="outline" className="h-10">
                    <Link href={`/saisonverleih/anzeigen/${verleih.ID}${materialId ? `?material=${materialId}` : ""}`}>
                        <ExternalLink className="h-4 w-4" />
                        Öffnen
                    </Link>
                </Button>
            </section>

            <section className="space-y-2">
                <div className="flex items-baseline justify-between gap-2">
                    <h2 className="text-lg font-semibold">Material ({material.length})</h2>
                    <p className="text-sm text-muted-foreground">{offen.length > 0 ? `${offen.length} ausgewählt` : "Ski antippen zum Auswählen"}</p>
                </div>
                <div className="space-y-2">
                    {material.map((m) => {
                        const gewaehlt = offen.includes(m.ID);
                        const waehlbar = !!m.Ski && !m.BindungGeprueft;
                        return (
                            <button
                                key={m.ID}
                                type="button"
                                onClick={() => umschalten(m)}
                                disabled={!waehlbar}
                                aria-pressed={gewaehlt}
                                className={cn(
                                    "flex min-h-14 w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors disabled:cursor-default",
                                    gewaehlt ? "border-primary bg-primary/5 ring-1 ring-primary" : waehlbar && "hover:bg-muted/50",
                                    m.ID === materialId && !gewaehlt && "border-primary/60",
                                )}
                            >
                                <span
                                    className={cn(
                                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2",
                                        gewaehlt ? "border-primary bg-primary text-primary-foreground" : waehlbar ? "border-muted-foreground/40" : "border-transparent",
                                    )}
                                >
                                    {gewaehlt && <Check className="h-4 w-4" />}
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate font-medium">{materialName(m)}</span>
                                    <span className="block truncate text-sm text-muted-foreground">
                                        {m.Ski ? `Ski ${m.Ski.SkiNr} · ${m.Ski.Modell.Hersteller.Name} ${m.Ski.Modell.Modell} · ${m.Ski.Laenge} cm` : "Ohne Ski"}
                                    </span>
                                </span>
                                {m.Ski && m.BindungGeprueft && (
                                    <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-green-200 bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                                        <BadgeCheck className="h-3.5 w-3.5" /> Geprüft
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </section>

            <div className="sticky bottom-0 -mx-4 space-y-2 border-t bg-background/95 px-4 py-3 backdrop-blur lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:backdrop-blur-none">
                <ScanMeldung meldung={meldung} />
                <div className="flex flex-wrap gap-2">
                    <Button className="h-11 flex-1 text-base" onClick={bindungGeprueft} disabled={offen.length === 0 || laeuft}>
                        <BadgeCheck className="h-5 w-5" />
                        {laeuft ? "Wird gespeichert..." : `Bindung geprüft${offen.length ? ` (${offen.length})` : ""}`}
                    </Button>
                    {zusatz}
                </div>
            </div>
        </div>
    );
}
