import { Button } from "@/components/ui/button";
import { getSaisonVerleihPDF } from "@/lib/saisonverleihactions";
import { startTransition, useActionState, useEffect } from "react";
import { FileText } from 'lucide-react';

type SaisonVerleiAnzeigeUebersichtPDFButtonProps = {
    saisonverleihanzeigeID: number;
}

export default function SaisonVerleiAnzeigeUebersichtPDFButton({ saisonverleihanzeigeID }: SaisonVerleiAnzeigeUebersichtPDFButtonProps) {
    const [state, action, isPending] = useActionState(getSaisonVerleihPDF, null);

    useEffect(() => {
        if (state instanceof Blob) {
          const url = URL.createObjectURL(state);
          const a = document.createElement("a");
          a.href = url;
          a.download = `saisonverleih-${saisonverleihanzeigeID}.pdf`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        }
      }, [state, saisonverleihanzeigeID]);

    function handlePDFDownload() {
        startTransition(() => action(saisonverleihanzeigeID));
    }

    if (isPending) {
        return <Button variant="outline" disabled>Loading...</Button>;
    }


    return (
        <Button variant="outline" onClick={handlePDFDownload}><FileText /> PDF</Button>
    );
}