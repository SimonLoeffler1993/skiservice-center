"use client";

import { useState, useTransition } from "react";
import { format, parseISO } from "date-fns";
import { BadgeCheck, ListChecks } from "lucide-react";

import { Button } from "@/components/ui/button";
import { pruefeVerleihBindungen } from "@/lib/bearbeitenactions";
import { MaterialRead } from "@/types/materialtypes";
import { SaisonverleihRead } from "@/types/saisonverleihtypes";
import { useVerleihAktualisieren } from "../bearbeiten/useVerleihAktualisieren";

// Bindungen markieren, Fehler bleiben beim Button stehen
function useBindungPruefen(verleihId: number) {
    const [fehler, setFehler] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const aktualisieren = useVerleihAktualisieren(verleihId);

    function pruefen(materialIds?: number[]) {
        startTransition(async () => {
            const antwort = await pruefeVerleihBindungen(verleihId, materialIds);
            if (!antwort.success) {
                setFehler(antwort.error);
                return;
            }
            setFehler(null);
            aktualisieren(antwort.data);
        });
    }

    return { pruefen, fehler, isPending };
}

// Bindung einer Materialzeile mit Ski: Button "Bindung prüfen" oder Hinweis "Bindung geprüft"
export default function MaterialBindungPruefen({ verleihId, material }: { verleihId: number; material: MaterialRead }) {
    const { pruefen, fehler, isPending } = useBindungPruefen(verleihId);

    if (!material.Ski) return null;

    if (material.BindungGeprueft) {
        return (
            <span
                className="inline-flex items-center gap-1 rounded-md border border-green-200 bg-green-50 px-2 py-1 text-xs font-medium text-green-700"
                title={material.BindungGeprueft_Am ? `Geprüft am ${format(parseISO(material.BindungGeprueft_Am), "dd.MM.yyyy")}` : undefined}
            >
                <BadgeCheck className="h-3.5 w-3.5" />
                Bindung geprüft
            </span>
        );
    }

    return (
        <>
            <Button type="button" variant="outline" size="sm" onClick={() => pruefen([material.ID])} disabled={isPending}>
                <BadgeCheck className="h-4 w-4" />
                {isPending ? "Wird geprüft..." : "Bindung prüfen"}
            </Button>
            {fehler && <p className="w-full text-sm text-destructive">{fehler}</p>}
        </>
    );
}

// Kopf der Detailansicht: alle offenen Bindungen auf einmal als geprüft markieren
export function AlleBindungenPruefenButton({ verleih }: { verleih: SaisonverleihRead }) {
    const { pruefen, fehler, isPending } = useBindungPruefen(verleih.ID);
    const offen = (verleih.Material ?? []).filter((m) => m.Ski && !m.BindungGeprueft).length;

    if (offen === 0 || (verleih.Status !== "vorbereitung" && verleih.Status !== "vorbereitet")) return null;

    return (
        <div className="space-y-1">
            <Button type="button" variant="outline" onClick={() => pruefen()} disabled={isPending}>
                <ListChecks className="h-4 w-4" />
                {isPending ? "Wird geprüft..." : `Alle Bindungen geprüft (${offen})`}
            </Button>
            {fehler && <p className="text-sm text-destructive">{fehler}</p>}
        </div>
    );
}
