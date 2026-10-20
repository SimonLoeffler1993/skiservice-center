"use client";

import { Button } from "@/components/ui/button";

type FehlerSeiteProps = {
    error: Error & { digest?: string };
    reset: () => void;
}

// Fallback für unerwartete Fehler, z.B. wenn das Backend während des Ladens ausfällt
export default function FehlerSeite({ error, reset }: FehlerSeiteProps) {
    return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-4 text-center">
            <h2 className="text-2xl font-semibold">Es ist ein Fehler aufgetreten</h2>
            <p className="text-muted-foreground">
                {error.digest ? `Fehlercode: ${error.digest}` : "Bitte erneut versuchen."}
            </p>
            <Button onClick={() => reset()}>Erneut versuchen</Button>
        </div>
    );
}
