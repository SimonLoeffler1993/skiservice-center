"use client";

import { useState, useTransition } from "react";
import { Bell, ChevronDown, MailCheck, MailWarning } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { benachrichtigeVerleih, setzeVerleihBenachrichtigt } from "@/lib/bearbeitenactions";
import { ApiAntwort } from "@/types/actiontypes";
import { SaisonverleihRead, VerleihBenachrichtigungSchema } from "@/types/saisonverleihtypes";
import { useVerleihAktualisieren } from "../bearbeiten/useVerleihAktualisieren";
import { BENACHRICHTIGUNG_ANZEIGE } from "../liste/VerleihBenachrichtigtBadge";

// Kunde per Mail zur Abholung oder Rückgabe benachrichtigen, oder die Benachrichtigung von Hand setzen
export default function VerleihBenachrichtigungAktion({ verleih }: { verleih: SaisonverleihRead }) {
    const [meldung, setMeldung] = useState<{ ok: boolean; text: string } | null>(null);
    const [isPending, startTransition] = useTransition();
    const aktualisieren = useVerleihAktualisieren(verleih.ID);
    const hatEmail = !!verleih.Kunde.Email;

    function ausfuehren(aktion: () => Promise<ApiAntwort<SaisonverleihRead>>, erfolg?: string) {
        startTransition(async () => {
            const antwort = await aktion();
            if (!antwort.success) {
                setMeldung({ ok: false, text: antwort.error });
                return;
            }
            setMeldung(erfolg ? { ok: true, text: erfolg } : null);
            aktualisieren(antwort.data);
        });
    }

    return (
        <div className="space-y-1">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button type="button" variant="outline" disabled={isPending}>
                        <Bell className="h-4 w-4" />
                        {isPending ? "Wird gesendet..." : "Benachrichtigen"}
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuLabel>
                        Per E-Mail
                        {!hatEmail && <span className="block text-xs font-normal text-muted-foreground">Keine E-Mail hinterlegt</span>}
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                        disabled={!hatEmail}
                        onSelect={() => ausfuehren(() => benachrichtigeVerleih(verleih.ID, "abholung"), "Abhol-Mail versendet")}
                    >
                        <MailCheck className="h-4 w-4" />
                        Abhol-Mail senden
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        disabled={!hatEmail}
                        onSelect={() => ausfuehren(() => benachrichtigeVerleih(verleih.ID, "rueckgabe"), "Rückgabe-Erinnerung versendet")}
                    >
                        <MailWarning className="h-4 w-4" />
                        Rückgabe-Erinnerung senden
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Von Hand setzen (ohne Mail)</DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                        value={verleih.Benachrichtigt}
                        onValueChange={(wert) => {
                            const neu = VerleihBenachrichtigungSchema.parse(wert);
                            if (neu !== verleih.Benachrichtigt) ausfuehren(() => setzeVerleihBenachrichtigt(verleih.ID, neu));
                        }}
                    >
                        {VerleihBenachrichtigungSchema.options.map((wert) => (
                            <DropdownMenuRadioItem key={wert} value={wert}>
                                {BENACHRICHTIGUNG_ANZEIGE[wert].text}
                            </DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            {meldung && <p className={`text-sm ${meldung.ok ? "text-green-700" : "text-destructive"}`}>{meldung.text}</p>}
        </div>
    );
}
