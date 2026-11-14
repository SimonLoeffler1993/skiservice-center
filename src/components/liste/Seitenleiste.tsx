import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type SeitenleisteProps = {
    seite: number;
    seiten: number;
    // Adresse einer Seite
    href: (seite: number) => string;
};

// Erste und letzte Seite sowie die Nachbarn der aktuellen, Lücken als null
function sichtbareSeiten(seite: number, seiten: number): (number | null)[] {
    const nummern = [...new Set([1, seite - 1, seite, seite + 1, seiten])].filter((n) => n >= 1 && n <= seiten).sort((a, b) => a - b);
    return nummern.flatMap((n, index) => (index > 0 && n - nummern[index - 1] > 1 ? [null, n] : [n]));
}

// Blättern in Listen mit Seiten: Zurück, Seitenzahlen, Weiter
export default function Seitenleiste({ seite, seiten, href }: SeitenleisteProps) {
    if (seiten <= 1) return null;

    const schritt = (ziel: number, aktiv: boolean, inhalt: React.ReactNode, titel: string) =>
        aktiv ? (
            <Button asChild variant="outline" className="h-10">
                <Link href={href(ziel)} scroll={false} rel={ziel < seite ? "prev" : "next"} aria-label={titel}>{inhalt}</Link>
            </Button>
        ) : (
            <Button variant="outline" className="h-10" disabled aria-label={titel}>{inhalt}</Button>
        );

    return (
        <nav aria-label="Seiten" className="flex items-center justify-between gap-2 sm:justify-center">
            {schritt(seite - 1, seite > 1, <><ChevronLeft className="h-4 w-4" /> Zurück</>, "Vorherige Seite")}

            {/* Handy: nur der Stand, ab Tablet die Seitenzahlen */}
            <span className="text-sm text-muted-foreground sm:hidden">Seite {seite} von {seiten}</span>
            <ul className="hidden items-center gap-1 sm:flex">
                {sichtbareSeiten(seite, seiten).map((nummer, index) => (
                    <li key={nummer ?? `luecke-${index}`}>
                        {nummer === null ? (
                            <span className="px-1 text-muted-foreground" aria-hidden>…</span>
                        ) : (
                            <Button asChild variant={nummer === seite ? "default" : "ghost"} className="h-10 min-w-10 px-3">
                                <Link href={href(nummer)} scroll={false} aria-label={`Seite ${nummer}`} aria-current={nummer === seite ? "page" : undefined}>
                                    {nummer}
                                </Link>
                            </Button>
                        )}
                    </li>
                ))}
            </ul>

            {schritt(seite + 1, seite < seiten, <>Weiter <ChevronRight className="h-4 w-4" /></>, "Nächste Seite")}
        </nav>
    );
}
