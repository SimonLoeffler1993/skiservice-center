import { Children } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";

// Rahmen der kompakten Listen im Dashboard, ab lg und mehr als einer Zeile zweispaltig.
// Die Zeilen haben den Strich oben, der oberste je Spalte verschwindet hinter dem Rahmen
export function WerkstattListe({ children }: { children: React.ReactNode }) {
    const zweispaltig = Children.count(children) > 1;
    return (
        <div className="overflow-hidden rounded-xl border bg-card">
            <div className={cn("-mt-px", zweispaltig && "lg:columns-2 lg:gap-0 lg:[column-rule:1px_solid_var(--border)]")}>{children}</div>
        </div>
    );
}

type WerkstattZeileProps = {
    href: string;
    // Auftrags- bzw. Verleihnummer
    nummer: string;
    name: string;
    // Zweite, kleine Zeile unter dem Namen: was noch zu tun ist
    detail?: React.ReactNode;
    // Dezente Zusatzangabe vor der Anzahl, auf dem Handy ausgeblendet
    zusatz?: React.ReactNode;
    // Rechts, z.B. "3 Ski"
    anzahl: React.ReactNode;
};

// Eine Zeile "Nummer · Name · Anzahl", ganze Zeile antippbar
export default function WerkstattZeile({ href, nummer, name, detail, zusatz, anzahl }: WerkstattZeileProps) {
    return (
        <Link
            href={href}
            className="flex min-h-10 break-inside-avoid items-center gap-3 border-t px-3 py-1.5 text-sm hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none"
        >
            <span className="w-24 shrink-0 font-semibold tabular-nums">{nummer}</span>
            <span className="min-w-0 flex-1">
                <span className="block truncate">{name}</span>
                {detail && <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">{detail}</span>}
            </span>
            {zusatz && <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">{zusatz}</span>}
            <span className="shrink-0 text-right font-semibold tabular-nums">{anzahl}</span>
        </Link>
    );
}

// Leerzustand: nichts mehr zu tun
export function WerkstattErledigt({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-dashed bg-muted/30 px-4 py-4 text-sm text-muted-foreground">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
            <p>{text}</p>
        </div>
    );
}
