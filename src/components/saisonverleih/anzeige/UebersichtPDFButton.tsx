"use client";

import { Button } from "@/components/ui/button";
import { FileText } from 'lucide-react';

type SaisonVerleiAnzeigeUebersichtPDFButtonProps = {
    saisonverleihanzeigeID: number;
}

// Öffnet das PDF in einem neuen Tab
export default function SaisonVerleiAnzeigeUebersichtPDFButton({ saisonverleihanzeigeID }: SaisonVerleiAnzeigeUebersichtPDFButtonProps) {
    return (
        <Button variant="outline" asChild>
            <a href={`/api/pdf/verleih/${saisonverleihanzeigeID}`} target="_blank" rel="noopener noreferrer">
                <FileText /> PDF
            </a>
        </Button>
    );
}
