import DialogQuittungZuweisen from "@/components/quittung/DialogQuttungZuweisen";
import { QuittungZiel } from "@/lib/quittungactions";

type ButtonQuittungZuweisenProps = {
    quittungID: number | null | undefined;
    // Saisonverleih oder Skiservice-Auftrag
    ziel: QuittungZiel;
}

// Nur anzeigen, solange noch keine Quittung zugewiesen ist
export default function ButtonQuittungZuweisen({ quittungID, ziel }: ButtonQuittungZuweisenProps) {
    if (!quittungID) {
        return <DialogQuittungZuweisen ziel={ziel} />
    }
    return null;
}
