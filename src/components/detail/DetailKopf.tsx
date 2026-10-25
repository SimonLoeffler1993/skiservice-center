import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { cn, euro } from "@/lib/utils";

type DetailKopfProps = {
    zurueckHref: string;
    zurueckText: string;
    titel: string;
    // z.B. Kundenname und Zeitraum
    unterzeile?: React.ReactNode;
    badges?: React.ReactNode;
    betrag: number;
    // Nächster Schritt im Ablauf, z.B. "Abgeholt" oder "Alle fertig"
    hauptaktion?: React.ReactNode;
};

// Kopf der Detailansichten (Verleih, Skiservice): Nummer, Status, Gesamtbetrag und Hauptaktion
export default function DetailKopf({ zurueckHref, zurueckText, titel, unterzeile, badges, betrag, hauptaktion }: DetailKopfProps) {
    return (
        <header className="space-y-2">
            <Link
                href={zurueckHref}
                className="-ml-1 inline-flex min-h-8 items-center gap-1 rounded-md pr-2 text-sm text-muted-foreground hover:text-foreground"
            >
                <ChevronLeft className="h-4 w-4" />
                {zurueckText}
            </Link>
            <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
                <div className="min-w-0 space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{titel}</h1>
                    {unterzeile && <p className="text-muted-foreground">{unterzeile}</p>}
                    {badges && <div className="flex flex-wrap items-center gap-2">{badges}</div>}
                </div>
                <div className="flex flex-col items-start gap-3 sm:ml-auto sm:items-end">
                    <div className="sm:text-right">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Gesamt</p>
                        <p className="text-3xl font-bold tabular-nums leading-tight">{euro.format(betrag)}</p>
                    </div>
                    {hauptaktion}
                </div>
            </div>
        </header>
    );
}

// Aktionsleiste unter dem Kopf: gleich hohe Buttons (40 px für Touch), die auf dem Handy umbrechen
export function DetailAktionsleiste({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("flex flex-wrap items-center gap-2 border-y py-3 [&_:is(button,a)]:h-10", className)}>
            {children}
        </div>
    );
}

// Karte im Seitenbereich (Quittung, Bemerkung)
export function DetailKarte({ titel, icon: Icon, children, className }: {
    titel: string;
    icon?: React.ComponentType<{ className?: string }>;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <section className={cn("rounded-xl border bg-card p-4 sm:p-5", className)}>
            <h2 className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {Icon && <Icon className="h-4 w-4" />}
                {titel}
            </h2>
            {children}
        </section>
    );
}
