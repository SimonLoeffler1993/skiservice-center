"use client";

import { Button } from "@/components/ui/button";
import { useBackendUrl } from "@/context/backend-context";
import { FileText } from 'lucide-react';

type SaisonVerleiAnzeigeUebersichtPDFButtonProps = {
    saisonverleihanzeigeID: number;
}

// Öffnet das PDF in einem neuen Tab
export default function SaisonVerleiAnzeigeUebersichtPDFButton({ saisonverleihanzeigeID }: SaisonVerleiAnzeigeUebersichtPDFButtonProps) {
    const backendUrl = useBackendUrl();
    return (
        <Button variant="outline" asChild>
            <a href={`${backendUrl}/api/v1/saisonverleih/pdf/${saisonverleihanzeigeID}`} target="_blank" rel="noopener noreferrer">
                <FileText /> PDF
            </a>
        </Button>
    );
}
