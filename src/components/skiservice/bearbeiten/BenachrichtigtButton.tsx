"use client";

import { useState, useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { PhoneCall, Undo2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { aendereAuftrag } from "@/lib/bearbeitenactions";
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

// Kunde von Hand als benachrichtigt markieren (z.B. angerufen) oder das jederzeit wieder zurücknehmen
export default function BenachrichtigtButton({ auftrag, nurMarkieren = false, variant = "outline" }: BenachrichtigtButtonProps) {
    const [fehler, setFehler] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const aktualisieren = useAuftragAktualisieren(auftrag.id);
    const queryClient = useQueryClient();
    const benachrichtigt = istBenachrichtigt(auftrag);

    if (nurMarkieren && benachrichtigt) return null;

    function setzen(wert: boolean) {
        startTransition(async () => {
            const antwort = await aendereAuftrag(auftrag.id, { benachrichtigt: wert });
            if (!antwort.success) {
                setFehler(antwort.error);
                return;
            }
            setFehler(null);
            aktualisieren(antwort.data);
            queryClient.invalidateQueries({ queryKey: ["skiserviceList"] });
        });
    }

    return (
        <span className="inline-flex flex-col gap-1">
            {benachrichtigt ? (
                <Button type="button" variant="ghost" size="sm" onClick={() => setzen(false)} disabled={isPending}>
                    <Undo2 className="h-4 w-4" />
                    Benachrichtigung zurücksetzen
                </Button>
            ) : (
                <Button type="button" variant={variant} size="sm" onClick={() => setzen(true)} disabled={isPending}>
                    <PhoneCall className="h-4 w-4" />
                    Als benachrichtigt markieren
                </Button>
            )}
            {fehler && <span className="text-sm text-destructive">{fehler}</span>}
        </span>
    );
}
