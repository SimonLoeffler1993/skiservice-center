"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DatabaseZap, ServerCrash } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

// Nach so vielen Sekunden wird automatisch erneut geprüft
const AUTOMATISCH_SEKUNDEN = 15;

type VerbindungsFehlerProps = {
    zustand: "api" | "datenbank";
}

const TEXTE = {
    api: {
        titel: "Keine Verbindung zur API",
        text: "Der Server ist nicht erreichbar. Bitte Netzwerk und den API-Container prüfen.",
    },
    datenbank: {
        titel: "Keine Verbindung zur Datenbank",
        text: "Die API läuft, aber die Datenbank antwortet nicht. Bitte den Datenbank-Server prüfen.",
    },
};

/** Ersetzt die Startseite, solange API oder Datenbank nicht erreichbar sind. */
export default function VerbindungsFehler({ zustand }: VerbindungsFehlerProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const { titel, text } = TEXTE[zustand];
    const Icon = zustand === "datenbank" ? DatabaseZap : ServerCrash;

    // Regelmäßig neu laden, damit die Startseite nach der Behebung von selbst wieder erscheint
    useEffect(() => {
        const timer = setInterval(() => router.refresh(), AUTOMATISCH_SEKUNDEN * 1000);
        return () => clearInterval(timer);
    }, [router]);

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Alert variant="destructive" className="max-w-lg">
                <Icon />
                <AlertTitle>{titel}</AlertTitle>
                <AlertDescription className="flex flex-col gap-3">
                    <p>{text}</p>
                    <p className="text-muted-foreground">
                        Es wird alle {AUTOMATISCH_SEKUNDEN} Sekunden automatisch erneut versucht.
                    </p>
                    <Button
                        variant="outline"
                        className="w-fit"
                        disabled={isPending}
                        onClick={() => startTransition(() => router.refresh())}
                    >
                        {isPending ? "Versuche erneut..." : "Erneut versuchen"}
                    </Button>
                </AlertDescription>
            </Alert>
        </div>
    );
}
