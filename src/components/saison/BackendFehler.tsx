"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ServerCrash } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type BackendFehlerProps = {
    meldung: string;
}

export default function BackendFehler({ meldung }: BackendFehlerProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    return (
        <Alert variant="destructive" className="max-w-lg">
            <ServerCrash />
            <AlertTitle>Keine Verbindung zum Backend</AlertTitle>
            <AlertDescription className="flex flex-col gap-3">
                <p>{meldung}</p>
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
    );
}
