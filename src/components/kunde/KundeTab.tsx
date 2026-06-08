import { useKundeStore } from "@/stores/useKundeStore";
import KundeSuchForm from "./suche/suchform";
import KundeForm from "./KundeForm";
import { Button } from "../ui/button";
import { useState } from "react";
import { Kunde } from "@/types/skikundentypes";

export default function KundeTab() {
    const { kunde, setKunde } = useKundeStore();
    const [zeigenKundeSuchen, setZeigenKundeSuchen] = useState(!kunde);


    console.log("Aktuell ausgewählter Kunde:", kunde);

    function handleKundeAuswaehlen(selectedKunde: Kunde) {
        setKunde(selectedKunde);
        setZeigenKundeSuchen(false);
    }

    if (zeigenKundeSuchen) {
        return (
            <div>
                {kunde && zeigenKundeSuchen ? (
                    <Button variant="outline" size="sm" onClick={() => setZeigenKundeSuchen(false)}>
                        Abbrechen
                    </Button>
                ) : null}
                <KundeSuchForm onKundeSelected={handleKundeAuswaehlen} />
            </div>
        );
    }

    if (!kunde) {
        return (
            <div>
                <p className="text-sm text-muted-foreground">Kein Kunde ausgewählt.</p>
                <Button variant="outline" size="sm" onClick={() => setZeigenKundeSuchen(true)}>
                    Kunde auswählen
                </Button>
            </div>
        );
    }

    return (
        <div>
            <Button variant="outline" size="sm" onClick={() => setZeigenKundeSuchen(true)}>
                Kunde wechseln
            </Button>
            <KundeForm kunde={kunde} />
        </div>
    );
}