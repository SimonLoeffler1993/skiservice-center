"use client";

import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "../ui/dialog";
import { kundeTerminaAbfragen } from "@/lib/terminalactions";
import { useActionState, startTransition } from "react";
import KundeTerminalAuswahl from "./KundeTerminalAuswahl";
import { useState } from "react";
import KundeTerminalSendenButton from "./KundeTerminalSendenButton";

export default function KundeTerminalButton() {

    const [state, action, isPending] = useActionState(kundeTerminaAbfragen, null);
    const [selectedTerminal, setSelectedTerminal] = useState<string | null>(null);

    const handleClick = () => {
        startTransition(() => {
            action();
        });
    };


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button onClick={handleClick} variant="outline" size="sm" className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Kunde ans Terminal senden
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Kunde ans Terminal senden</DialogTitle>
                </DialogHeader>
                {isPending && (
                    <p className="text-center">Terminals werden geladen...</p>
                )}
                {!isPending && (
                    <KundeTerminalAuswahl terminals={state?.terminals || []} selectedTerminal={selectedTerminal || ""} setSelectedTerminal={setSelectedTerminal} />         
                )}
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Abbrechen</Button>
                    </DialogClose>
                    {/* Es werden nur Terminal übergeben Kunde kommt aus dem Context */}
                    <KundeTerminalSendenButton terminal={selectedTerminal || ""} />
                </DialogFooter>
            </DialogContent> 
        </Dialog>
    );
}