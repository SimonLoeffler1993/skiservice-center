"use client";

import { useState, useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { PackageCheck, Undo2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { setzeAuftragAbgeholt } from "@/lib/bearbeitenactions";
import { Auftrag } from "@/types/skiservicetypes";
import { useAuftragAktualisieren } from "./useAuftragAktualisieren";

// Auftrag auf abgeholt setzen bzw. die Abholung zurücknehmen, auch bei bezahlten Aufträgen
export default function AuftragAbgeholtButton({ auftrag }: { auftrag: Auftrag }) {
    const queryClient = useQueryClient();
    const aktualisieren = useAuftragAktualisieren(auftrag.id);
    const [fehler, setFehler] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const abgeholt = auftrag.wie === "2";

    function setzen() {
        startTransition(async () => {
            const antwort = await setzeAuftragAbgeholt(auftrag.id, !abgeholt);
            if (!antwort.success) {
                setFehler(antwort.error);
                return;
            }
            setFehler(null);
            aktualisieren(antwort.data);
            queryClient.invalidateQueries({ queryKey: ["skiserviceList"] });
            queryClient.invalidateQueries({ queryKey: ["werkstatt"] });
        });
    }

    return (
        <div className="space-y-1">
            {/* Hauptaktion erst, wenn der Auftrag fertig ist */}
            <Button type="button" variant={auftrag.wie === "1" ? "default" : "outline"} onClick={setzen} disabled={isPending}>
                {abgeholt ? <Undo2 className="h-4 w-4" /> : <PackageCheck className="h-4 w-4" />}
                {abgeholt ? "Abholung zurücknehmen" : "Abgeholt"}
            </Button>
            {fehler && <p className="text-sm text-destructive">{fehler}</p>}
        </div>
    );
}
