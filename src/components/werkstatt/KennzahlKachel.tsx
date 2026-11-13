import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type KennzahlKachelProps = {
    titel: string;
    icon: LucideIcon;
    // Große Zahl
    wert: number;
    // Text hinter der Zahl, z.B. "heute"
    einheit?: string;
    // Fortschritt erledigt / gesamt als Balken
    fortschritt?: { erledigt: number; gesamt: number };
    // Farbe des Balkens
    balken?: string;
    // Kleinere Angaben unter der Zahl
    children?: React.ReactNode;
    className?: string;
};

// Kachel mit einer Kennzahl, optional mit Fortschrittsbalken
export default function KennzahlKachel({ titel, icon: Icon, wert, einheit, fortschritt, balken = "bg-green-600", children, className }: KennzahlKachelProps) {
    const prozent = fortschritt && fortschritt.gesamt > 0
        ? Math.round((fortschritt.erledigt / fortschritt.gesamt) * 100)
        : null;

    return (
        <section className={cn("flex flex-col gap-2 rounded-xl border bg-card p-4", className)}>
            <h3 className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <Icon className="h-4 w-4" />
                {titel}
            </h3>
            <p className="text-3xl font-bold tabular-nums leading-tight">
                {wert}
                {einheit && <span className="ml-1.5 text-sm font-medium text-muted-foreground">{einheit}</span>}
            </p>
            {children && <div className="space-y-0.5 text-sm text-muted-foreground">{children}</div>}
            {fortschritt && (
                <div className="mt-auto space-y-1 pt-1">
                    <div
                        className="h-2 overflow-hidden rounded-full bg-muted"
                        role="progressbar"
                        aria-valuemin={0}
                        aria-valuemax={fortschritt.gesamt}
                        aria-valuenow={fortschritt.erledigt}
                        aria-label={`${titel}: ${fortschritt.erledigt} von ${fortschritt.gesamt}`}
                    >
                        <div className={cn("h-full rounded-full", balken)} style={{ width: `${prozent ?? 0}%` }} />
                    </div>
                    <p className="text-xs tabular-nums text-muted-foreground">
                        {fortschritt.erledigt} von {fortschritt.gesamt}{prozent !== null && ` · ${prozent} %`}
                    </p>
                </div>
            )}
        </section>
    );
}

// Zeile "Text ...... Zahl" in einer Kachel
export function KennzahlZeile({ text, wert }: { text: string; wert: number }) {
    return (
        <p className="flex items-baseline justify-between gap-3">
            <span>{text}</span>
            <span className="font-semibold tabular-nums text-foreground">{wert}</span>
        </p>
    );
}
