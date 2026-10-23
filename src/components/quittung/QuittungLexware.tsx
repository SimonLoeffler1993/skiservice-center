"use client";

import { useState, useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CloudUpload } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { quittungNachLexware } from "@/lib/quittungactions";
import { QuittungRead } from "@/types/quittungentypes";

type QuittungLexwareProps = {
    quittung: QuittungRead;
};

// Status der Übertragung an Lexware, bei eigenen Quittungen mit Button zum (erneuten) Hochladen
export default function QuittungLexware({ quittung }: QuittungLexwareProps) {
    const [fehler, setFehler] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const queryClient = useQueryClient();

    if (quittung.NurExtern) {
        return <Badge variant="outline">Lexware-Rechnung</Badge>;
    }
    if (quittung.BuchhaltungSync) {
        return <Badge variant="outline">In Lexware</Badge>;
    }
    if (quittung.LexwareModus !== "pdf") {
        return null;
    }

    function hochladen() {
        startTransition(async () => {
            const antwort = await quittungNachLexware(quittung.ID);
            if (!antwort.success) {
                setFehler(antwort.error);
                return;
            }
            setFehler(null);
            await queryClient.invalidateQueries({ queryKey: ["quittung", quittung.ID] });
        });
    }

    return (
        <div className="flex flex-col gap-1">
            <Button type="button" variant="outline" size="sm" onClick={hochladen} disabled={isPending}>
                <CloudUpload className="h-4 w-4" />
                {isPending ? "Wird hochgeladen..." : "PDF nach Lexware hochladen"}
            </Button>
            {fehler && <p className="text-xs text-destructive">{fehler}</p>}
        </div>
    );
}
