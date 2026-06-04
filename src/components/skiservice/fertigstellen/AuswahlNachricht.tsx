import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

type AuswahlNachrichtProps = {
    selectedSkiIds: number[];
}

export default function AuswahlNachricht({ selectedSkiIds }: AuswahlNachrichtProps) {

    if (selectedSkiIds.length > 0) {
        return (
            <Badge className="bg-gray-300 text-gray-800">{selectedSkiIds.length} Ski ausgewählt</Badge>
        )
    }

    return (
        <Alert variant="destructive" className="max-w-2xl mx-auto bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800 mb-6">
            <AlertTitle>keine Ski auswahl</AlertTitle>
            <AlertDescription>
                Bitte wählen die Ski aus, die fertig bearbeitet wurden.
            </AlertDescription>
        </Alert>
    )
}