"use client";

import { useState, useTransition } from "react";
import { ChevronDown, PackageCheck, Undo2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setzeVerleihStatus } from "@/lib/bearbeitenactions";
import { VerleihStatus, VerleihStatusSchema } from "@/types/saisonverleihtypes";
import { useVerleihAktualisieren } from "../bearbeiten/useVerleihAktualisieren";
import { STATUS_ANZEIGE } from "../liste/SaisonverleihCardStatus";

type VerleihStatusAktionProps = {
    verleihId: number;
    status: VerleihStatus;
};

// Nächster Schritt im Ablauf als Hauptbutton
const NAECHSTER: Partial<Record<VerleihStatus, { status: VerleihStatus; text: string; icon: typeof Undo2 }>> = {
    vorbereitung: { status: "unterwegs", text: "Abgeholt", icon: PackageCheck },
    unterwegs: { status: "zurueck", text: "Zurückgegeben", icon: Undo2 },
};

// Status weiterschalten (Vorbereitung -> Unterwegs -> Zurückgegeben) oder korrigieren
export default function VerleihStatusAktion({ verleihId, status }: VerleihStatusAktionProps) {
    const [fehler, setFehler] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const aktualisieren = useVerleihAktualisieren(verleihId);
    const naechster = NAECHSTER[status];

    function setzen(neu: VerleihStatus) {
        if (neu === status) return;
        startTransition(async () => {
            const antwort = await setzeVerleihStatus(verleihId, neu);
            if (!antwort.success) {
                setFehler(antwort.error);
                return;
            }
            setFehler(null);
            aktualisieren(antwort.data);
        });
    }

    return (
        <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
                {naechster && (
                    <Button type="button" onClick={() => setzen(naechster.status)} disabled={isPending}>
                        <naechster.icon className="h-4 w-4" />
                        {naechster.text}
                    </Button>
                )}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button type="button" variant="outline" disabled={isPending}>
                            Status ändern
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuLabel>Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup value={status} onValueChange={(wert) => setzen(VerleihStatusSchema.parse(wert))}>
                            {VerleihStatusSchema.options.map((wert) => (
                                <DropdownMenuRadioItem key={wert} value={wert}>
                                    {STATUS_ANZEIGE[wert].text}
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            {fehler && <p className="text-sm text-destructive">{fehler}</p>}
        </div>
    );
}
