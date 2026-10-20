import { DialogSaisonErfassen } from "./DialogSaisonErfassen";

export default function KeineSaison() {
    return (
        <div className="flex flex-col items-center gap-2 rounded-lg border bg-card p-6">
            <h2 className="text-2xl">Keine aktuelle Saison vorhanden!</h2>
            <p className="text-muted-foreground">Bitte zuerst eine Saison erfassen.</p>
            <DialogSaisonErfassen />
        </div>
    );
}
