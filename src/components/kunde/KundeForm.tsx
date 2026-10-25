"use client";

import { Mail, MapPin, Phone, Smartphone, X, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Kunde } from "@/types/skikundentypes";
import KundeErfassenDialog from "./KundeErfassenDialog";

type KundeFormProps = {
    kunde: Kunde;
    onClose?: () => void;
    // Mit Angabe kann der Kunde bearbeitet werden (z.B. nach der Auswahl)
    onGeaendert?: (kunde: Kunde) => void;
    className?: string;
};

function initialen(kunde: Kunde) {
    const teile = [kunde.Vorname, kunde.Nachname].map((t) => t?.trim()).filter(Boolean) as string[];
    if (teile.length >= 2) return (teile[0][0] + teile[1][0]).toUpperCase();
    return (teile[0] ?? "?").slice(0, 2).toUpperCase();
}

function KontaktZeile({ icon: Icon, href, text, titel }: { icon: LucideIcon; href: string; text: string; titel: string }) {
    return (
        <a
            href={href}
            title={titel}
            className="flex min-h-10 items-center gap-2 rounded-md px-2 text-sm hover:bg-muted"
        >
            <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{text}</span>
        </a>
    );
}

// Kompakte Kundenkarte: Name, Anschrift und antippbare Kontakte
export default function KundeForm({ kunde, onClose, onGeaendert, className }: KundeFormProps) {
    const name = [kunde.Vorname, kunde.Nachname].filter((t) => t?.trim()).join(" ") || "Ohne Namen";
    const ort = kunde.Ort ? `${kunde.Ort.Postlz} ${kunde.Ort.Ort}` : "";
    const hatAnschrift = !!(kunde.Strasse?.trim() || ort);
    const kontakte = [
        kunde.Tel?.trim() && { icon: Phone, href: `tel:${kunde.Tel.replace(/\s/g, "")}`, text: kunde.Tel, titel: "Telefon" },
        kunde.Handy?.trim() && { icon: Smartphone, href: `tel:${kunde.Handy.replace(/\s/g, "")}`, text: kunde.Handy, titel: "Handy" },
        kunde.Email?.trim() && { icon: Mail, href: `mailto:${kunde.Email}`, text: kunde.Email, titel: "E-Mail" },
    ].filter(Boolean) as { icon: LucideIcon; href: string; text: string; titel: string }[];

    return (
        // @container: Anschrift und Kontakt nebeneinander, sobald die Karte breit genug ist
        <section className={cn("@container rounded-xl border bg-card p-4 sm:p-5", className)}>
            {/* Buttons rutschen in eine eigene Zeile, bevor der Name abgeschnitten wird */}
            <div className="flex flex-wrap items-start gap-3">
                <div className="flex min-w-[12rem] flex-1 items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-800">
                        {initialen(kunde)}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Kunde</p>
                        <p className="break-words text-lg font-semibold leading-tight">{name}</p>
                        <p className="text-xs text-muted-foreground">Kunde #{kunde.ID}</p>
                    </div>
                </div>
                <div className="ml-auto flex shrink-0 items-center gap-1">
                    {onGeaendert && <KundeErfassenDialog kunde={kunde} onGespeichert={onGeaendert} />}
                    {onClose && (
                        <Button variant="ghost" size="icon" onClick={onClose} title="Schließen">
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 @md:grid-cols-2">
                <div className="flex gap-2 px-2 text-sm">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    {hatAnschrift ? (
                        <p className="leading-relaxed">
                            {kunde.Strasse?.trim() && <>{kunde.Strasse}<br /></>}
                            {ort}
                        </p>
                    ) : (
                        <p className="text-muted-foreground">Keine Anschrift hinterlegt</p>
                    )}
                </div>
                <div className="-my-2 space-y-0.5">
                    {kontakte.length > 0 ? (
                        kontakte.map((kontakt) => <KontaktZeile key={kontakt.titel} {...kontakt} />)
                    ) : (
                        <p className="flex min-h-10 items-center px-2 text-sm text-muted-foreground">Kein Kontakt hinterlegt</p>
                    )}
                </div>
            </div>
        </section>
    );
}
