import { useEffect, useTransition } from "react";
import { LucideIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import useTimer from "@/hooks/useTimer";

type CountdownAktionProps = {
    // Aktuelle Auswahl als Text: ändert sie sich, startet der Countdown neu, leer = nichts zu tun
    schluessel: string;
    // Beschriftung des Buttons, z.B. "Fertigstellen"
    text: string;
    // Beschriftung, solange gespeichert wird
    laeuftText: string;
    icon: LucideIcon;
    ausfuehren: () => Promise<void>;
};

// Hardware-Scanner: Aktion nach 10 s Countdown ausführen, Abbrechen hält den Countdown an
export default function CountdownAktion({ schluessel, text, laeuftText, icon: Icon, ausfuehren }: CountdownAktionProps) {
    const { countdown, pause, resetTimer, setPause } = useTimer();
    const [isPending, startTransition] = useTransition();
    const gesperrt = schluessel === "" || isPending;

    useEffect(() => {
        if (schluessel === "") {
            setPause(true);
            return;
        }
        setPause(false);
        resetTimer();
    }, [schluessel, resetTimer, setPause]);

    function starten() {
        setPause(true);
        startTransition(ausfuehren);
    }

    useEffect(() => {
        if (countdown === 0 && schluessel !== "") {
            starten();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [countdown]);

    const laeuft = !pause && !gesperrt;

    return (
        <div className="flex gap-2">
            <Button className="h-11 flex-1 text-base" onClick={starten} disabled={gesperrt}>
                <Icon className="h-5 w-5" />
                {isPending ? laeuftText : laeuft ? `${text} in ${countdown} s` : text}
            </Button>
            <Button className="h-11 flex-1 text-base sm:flex-none sm:px-6" onClick={() => setPause(true)} variant="outline" disabled={!laeuft}>
                <X className="h-5 w-5" />
                Abbrechen
            </Button>
        </div>
    );
}
