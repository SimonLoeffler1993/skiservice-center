"use client";

import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useSkikundenContext } from "@/context/skikunden-context";
import { useActionState, startTransition } from "react";
import { kundeTerminalSenden } from "@/lib/terminalactions";

type KundeTerminalSendenButtonProps = {
    terminal: string;
};

// Wrapper function that matches useActionState signature
async function sendeKundeAction(
    state: { terminals: string[] } | null,
    payload: { terminal: string; kunde_id: number }
) {
    return await kundeTerminalSenden(payload.terminal, payload.kunde_id);
}

export default function KundeTerminalSendenButton({ terminal }: KundeTerminalSendenButtonProps) {
    const { kunde } = useSkikundenContext();
    const [state, action, isPending] = useActionState(sendeKundeAction, null);

    const handleClick = () => {
        if (kunde?.ID && terminal) {
            startTransition(() => {
                action({ terminal, kunde_id: kunde.ID });
            });
        }
    };

    return (
        <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2" 
            disabled={!terminal || !kunde || isPending}
            onClick={handleClick}
        >
            <Send className="h-4 w-4" />
            {isPending ? "Sende..." : "Kunde ans Terminal senden"}
        </Button>
    );
}