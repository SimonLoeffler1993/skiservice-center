"use client";

import { useState, useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Mail, PhoneCall, Undo2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { aendereAuftrag, sendeFertigMail } from "@/lib/bearbeitenactions";
import { ApiAntwort } from "@/types/actiontypes";
import { Auftrag } from "@/types/skiservicetypes";
import { useAuftragAktualisieren } from "./useAuftragAktualisieren";

type BenachrichtigtButtonProps = {
    auftrag: Auftrag;
    // Nur "Als benachrichtigt markieren" anzeigen, nach dem Markieren ausblenden (z.B. im Scanner)
    nurMarkieren?: boolean;
    variant?: "default" | "outline";
};

// In alten Daten ist "ja" unterschiedlich geschrieben
export function istBenachrichtigt(auftrag: Auftrag) {
    return auftrag.benachrichtigt?.toUpperCase() === "JA";
}

// Fertig-Mail von Hand senden, Kunde ohne Mail als benachrichtigt markieren (z.B. angerufen) oder das jederzeit wieder zurücknehmen
export default function BenachrichtigtButton({ auftrag, nurMarkieren = false, variant = "outline" }: BenachrichtigtButtonProps) {
    const [meldung, setMeldung] = useState<{ ok: boolean; text: string } | null>(null);
    const [isPending, startTransition] = useTransition();
    const aktualisieren = useAuftragAktualisieren(auftrag.id);
    const queryClient = useQueryClient();
    const benachrichtigt = istBenachrichtigt(auftrag);
    // Mail nur für fertige Aufträge mit E-Mail beim Kunden
    const mailMoeglich = !nurMarkieren && auftrag.wie === "1" && !!auftrag.kunde?.Email;

    if (nurMarkieren && benachrichtigt) return null;

    function ausfuehren(aktion: () => Promise<ApiAntwort<Auftrag>>, erfolg?: string) {
        startTransition(async () => {
            const antwort = await aktion();
            if (!antwort.success) {
                setMeldung({ ok: false, text: antwort.error });
                return;
            }
            setMeldung(erfolg ? { ok: true, text: erfolg } : null);
            aktualisieren(antwort.data);
            queryClient.invalidateQueries({ queryKey: ["skiserviceList"] });
        });
    }

    const mailSenden = () => ausfuehren(() => sendeFertigMail(auftrag.id), "Fertig-Mail versendet");
    const setzen = (wert: boolean) => ausfuehren(() => aendereAuftrag(auftrag.id, { benachrichtigt: wert }));

    return (
        <span className="inline-flex flex-col gap-1">
            <span className="inline-flex flex-wrap gap-2">
                {benachrichtigt ? (
                    <>
                        {mailMoeglich && (
                            <Button type="button" variant="ghost" size="sm" onClick={mailSenden} disabled={isPending}>
                                <Mail className="h-4 w-4" />
                                Fertig-Mail erneut senden
                            </Button>
                        )}
                        <Button type="button" variant="ghost" size="sm" onClick={() => setzen(false)} disabled={isPending}>
                            <Undo2 className="h-4 w-4" />
                            Benachrichtigung zurücksetzen
                        </Button>
                    </>
                ) : (
                    <>
                        {mailMoeglich && (
                            <Button type="button" variant={variant} size="sm" onClick={mailSenden} disabled={isPending}>
                                <Mail className="h-4 w-4" />
                                {isPending ? "Wird gesendet..." : "Fertig-Mail senden"}
                            </Button>
                        )}
                        <Button type="button" variant={mailMoeglich ? "outline" : variant} size="sm" onClick={() => setzen(true)} disabled={isPending}>
                            <PhoneCall className="h-4 w-4" />
                            Als benachrichtigt markieren
                        </Button>
                    </>
                )}
            </span>
            {meldung && <span className={`text-sm ${meldung.ok ? "text-green-700" : "text-destructive"}`}>{meldung.text}</span>}
        </span>
    );
}
