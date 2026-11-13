import Link from "next/link";
import { CalendarDays, Snowflake, type LucideIcon } from "lucide-react";

import { STATUS_ANZEIGE } from "@/components/saisonverleih/liste/SaisonverleihCardStatus";
import { cn } from "@/lib/utils";
import { VerleihArt, VerleihStatusSchema } from "@/types/saisonverleihtypes";
import type { VerleihStatusZahlen } from "@/types/werkstatttypes";

type VerleihUebersichtProps = {
    saison: VerleihStatusZahlen;
    tag: VerleihStatusZahlen;
};

// Zeile mit Zahl, führt in die gefilterte Verleih-Liste
function Zeile({ href, children, wert, warnung }: { href: string; children: React.ReactNode; wert: number; warnung?: boolean }) {
    return (
        <Link
            href={href}
            className="flex min-h-10 items-center justify-between gap-3 rounded-md px-2 text-sm hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
            <span className="inline-flex items-center gap-2">{children}</span>
            <span className={cn("font-semibold tabular-nums", warnung && wert > 0 && "text-red-600")}>{wert}</span>
        </Link>
    );
}

function ArtKarte({ art, titel, icon: Icon, zahlen }: { art: VerleihArt; titel: string; icon: LucideIcon; zahlen: VerleihStatusZahlen }) {
    const liste = `/saisonverleih/anzeigen?art=${art}`;

    return (
        <section className="rounded-xl border bg-card p-4">
            <div className="mb-2 flex items-start justify-between gap-3">
                <h3 className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <Icon className="h-4 w-4" />
                    {titel}
                </h3>
                <Link href={liste} className="text-right hover:underline">
                    <span className="text-3xl font-bold tabular-nums leading-tight">{zahlen.gesamt}</span>
                    <span className="ml-1.5 text-sm font-medium text-muted-foreground">gesamt</span>
                </Link>
            </div>
            <div className="-mx-2">
                {VerleihStatusSchema.options.map((status) => {
                    const { text, icon: StatusIcon, farbe } = STATUS_ANZEIGE[status];
                    return (
                        <Zeile key={status} href={`${liste}&status=${status}`} wert={zahlen[status]}>
                            <span className={`inline-flex h-6 w-6 items-center justify-center rounded-md border ${farbe}`}>
                                <StatusIcon className="h-3.5 w-3.5" />
                            </span>
                            {text}
                        </Zeile>
                    );
                })}
                <div className="mx-2 my-1 border-t" />
                <Zeile href={`${liste}&bezahlt=nein`} wert={zahlen.unbezahlt} warnung>Nicht bezahlt</Zeile>
                {art === "tag" && (
                    <Zeile href={`${liste}&status=unterwegs`} wert={zahlen.rueckgabe_faellig} warnung>Rückgabe fällig</Zeile>
                )}
            </div>
        </section>
    );
}

// Übersicht über den Verleih der Saison: Anzahl je Status für Saison- und Tagesverleih
export default function VerleihUebersicht({ saison, tag }: VerleihUebersichtProps) {
    return (
        <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Verleih-Übersicht</h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                <ArtKarte art="saison" titel="Saisonverleih" icon={Snowflake} zahlen={saison} />
                <ArtKarte art="tag" titel="Tagesverleih" icon={CalendarDays} zahlen={tag} />
            </div>
        </section>
    );
}
