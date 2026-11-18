"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { FileText, MailCheck, MailWarning } from "lucide-react";

import { ListeLeerText } from "@/components/liste/NachSaison";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useBackendUrl } from "@/context/backend-context";
import { mailProtokollOptions } from "@/hooks/useMailProtokollOptions";
import { cn } from "@/lib/utils";
import { MailProtokollBezug, MailProtokollEintrag } from "@/types/mailprotokolltypes";

// Schlüssel der Mail-Vorlagen in der API
const ART: Record<string, string> = {
    skiservice_fertig: "Skiservice fertig",
    verleih_abholung: "Verleih: Abholung",
    verleih_rueckgabe_tag: "Verleih: Rückgabe",
    verleih_rueckgabe_saison: "Verleih: Rückgabe",
    quittung: "Quittung",
};

const zeitpunkt = (wert: string) => format(parseISO(wert), "dd.MM.yyyy HH:mm");

type MailProtokollListeProps = {
    bezug: MailProtokollBezug;
    id: number;
    // Schmale Darstellung für die Seitenspalte von Auftrag und Verleih
    kompakt?: boolean;
};

// Die an den Kunden versendeten Mails mit Sendeergebnis, ein Klick zeigt den Inhalt
export default function MailProtokollListe({ bezug, id, kompakt = false }: MailProtokollListeProps) {
    const { data, isPending, error } = useQuery(mailProtokollOptions(bezug, id));
    const [offen, setOffen] = useState<MailProtokollEintrag | null>(null);

    if (isPending) return <p className="text-sm text-muted-foreground">Nachrichten werden geladen...</p>;
    if (error) return <p className="text-sm text-destructive">{error.message}</p>;
    if (data.length === 0) {
        return kompakt
            ? <p className="text-sm text-muted-foreground">Noch keine Nachricht versendet.</p>
            : <ListeLeerText text="Noch keine Nachricht versendet." />;
    }

    return (
        <>
            <ul className={cn("divide-y", !kompakt && "rounded-lg border")}>
                {data.map((mail) => (
                    <li key={mail.ID} className={cn("py-2.5 first:pt-0 last:pb-0", !kompakt && "px-4 first:pt-2.5 last:pb-2.5")}>
                        <button
                            type="button"
                            onClick={() => setOffen(mail)}
                            title="Nachricht anzeigen"
                            className="w-full rounded-sm text-left outline-none hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                                <span className="text-sm font-medium">{ART[mail.Vorlage] ?? mail.Vorlage}</span>
                                <MailErgebnis erfolgreich={mail.Erfolgreich} />
                            </div>
                            <p className="mt-0.5 break-words text-xs text-muted-foreground">
                                {zeitpunkt(mail.Gesendet_Am)} · {mail.Empfaenger}
                            </p>
                            {!kompakt && mail.Betreff && <p className="mt-0.5 break-words text-sm">{mail.Betreff}</p>}
                            {!mail.Erfolgreich && mail.Fehler && (
                                <p className="mt-0.5 break-words text-xs text-red-700">{mail.Fehler}</p>
                            )}
                        </button>
                        {/* Bei Auftrag und Verleih ist der Bezug die Seite selbst */}
                        {!kompakt && <MailBezuege mail={mail} />}
                        <QuittungAnhang mail={mail} />
                    </li>
                ))}
            </ul>

            <Dialog open={offen !== null} onOpenChange={(auf) => !auf && setOffen(null)}>
                <DialogContent className="sm:max-w-2xl">
                    {offen && (
                        <>
                            <DialogHeader>
                                <DialogTitle>{offen.Betreff || ART[offen.Vorlage] || "Nachricht"}</DialogTitle>
                                <DialogDescription>
                                    {zeitpunkt(offen.Gesendet_Am)} an {offen.Empfaenger}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-wrap items-center gap-3">
                                <MailErgebnis erfolgreich={offen.Erfolgreich} />
                                <QuittungAnhang mail={offen} />
                            </div>
                            {!offen.Erfolgreich && offen.Fehler && (
                                <p className="break-words rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">{offen.Fehler}</p>
                            )}
                            {offen.Inhalt ? (
                                // sandbox: die Mail kann hier nichts ausführen und keine Links öffnen
                                <iframe title="Inhalt der Nachricht" sandbox="" srcDoc={offen.Inhalt} className="h-[28rem] w-full rounded-md border bg-white" />
                            ) : (
                                <p className="text-sm text-muted-foreground">Die Nachricht konnte nicht erstellt werden, es gibt keinen Inhalt.</p>
                            )}
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

function MailErgebnis({ erfolgreich }: { erfolgreich: boolean }) {
    const Icon = erfolgreich ? MailCheck : MailWarning;
    return (
        <Badge
            variant="outline"
            className={cn("gap-1", erfolgreich ? "border-green-300 bg-green-50 text-green-700" : "border-red-300 bg-red-50 text-red-700")}
        >
            <Icon className="h-3 w-3" />
            {erfolgreich ? "Gesendet" : "Fehlgeschlagen"}
        </Badge>
    );
}

// Zu welchem Auftrag bzw. Verleih die Mail gehört, bei einer Quittungs-Mail alle auf der Quittung
function MailBezuege({ mail }: { mail: MailProtokollEintrag }) {
    if (mail.Bezuege.length === 0) return null;
    return (
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-sm">
            {mail.Bezuege.map((bezug) => (
                <Link
                    key={`${bezug.art}-${bezug.id}`}
                    href={bezug.art === "auftrag" ? `/skiservice/anzeigen/${bezug.id}` : `/saisonverleih/anzeigen/${bezug.id}`}
                    className="underline-offset-2 hover:underline"
                >
                    {bezug.art === "auftrag" ? "Skiservice" : "Verleih"} {bezug.name?.trim() || `#${bezug.id}`}
                </Link>
            ))}
        </div>
    );
}

// Der Anhang wird nicht gespeichert: der Link führt zur Quittung selbst
function QuittungAnhang({ mail }: { mail: MailProtokollEintrag }) {
    const backendUrl = useBackendUrl();
    if (!mail.Quittung_ID) return null;
    return (
        <a
            href={`${backendUrl}/api/v1/quittungen/quittung/${mail.Quittung_ID}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
            <FileText className="h-3.5 w-3.5" />
            Anhang: Quittung {mail.Quittung_Nummer ?? mail.Quittung_ID}
        </a>
    );
}
