'use client';

import Quittungsliste from "@/components/lex/Quittungsliste";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";

export default function ButtonQuittungZuweisen() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    // SaisonID aus den URL-Parametern holen
    const { id } = useParams<{ id: string }>();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const selectedVoucherNumber = formData.get("selectedBeleg") as string;
        
        console.log("Zugewiesen:", selectedVoucherNumber);
        console.log("SaisonID:", id);
        // Hier deine Aktion
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Quittung zuweisen</Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col max-h-[80vh]">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 min-h-0 flex-1">
                    <DialogHeader>
                        <DialogTitle>Quittung zuweisen</DialogTitle>
                        <DialogDescription>Wähle einen Beleg aus der Liste aus.</DialogDescription>
                    </DialogHeader>

                    <div ref={scrollContainerRef} className="overflow-y-auto flex-1 min-h-0 px-1 pb-2">
                        <Quittungsliste scrollContainerRef={scrollContainerRef} />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                            Abbrechen
                        </Button>
                        <Button type="submit">
                            Zuweisen
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}