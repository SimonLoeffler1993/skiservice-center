"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type UebersichtGespeichertProps = {
    id: number;
}

export default function UebersichtGespeichert({id}: UebersichtGespeichertProps) {
    const router = useRouter();

    function handleNeuerSaisonverleih() {
        window.location.href = "/saisonverleih/erstellen"
    }

    return (
        <Alert>
            <CheckCircle2Icon />
            <AlertTitle>Gespeichert</AlertTitle>
            <AlertDescription>
                Ihre Saisonverleih wurde erfolgreich gespeichert.
            </AlertDescription>
            <div className="flex gap-2">
                <Button variant="default" onClick={() => router.push(`/saisonverleih/anzeigen/${id}`)}>
                    Anzeigen
                </Button>
                <Button variant="outline" onClick={handleNeuerSaisonverleih}>
                    Neuer Saisonverleih
                </Button>
            </div>
        </Alert>
    );
}
