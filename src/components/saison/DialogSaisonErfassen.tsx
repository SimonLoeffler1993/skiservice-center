"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { saisonAnlegen } from "@/lib/saisonactions"
import { useRouter } from "next/navigation"
import { useState, useTransition,  } from "react"


function getAktuelleSaisonString(): string {
    const jahr = new Date().getFullYear();
    const naechstesJahr = jahr + 1;
    return `${String(jahr).slice(-2)}/${String(naechstesJahr).slice(-2)}`;
}

export function DialogSaisonErfassen() {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const saison = formData.get("saison") as string;
        const von = formData.get("von") as string;
        const bis = formData.get("bis") as string;

        startTransition(async () => {
            const result = await saisonAnlegen(saison, von, bis);
            if (result) {
                setOpen(false);
                router.refresh()
            } else {
                console.error("Saison konnte nicht angelegt werden.");
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Erfassen</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Saison erfassen</DialogTitle>
                    <DialogDescription>
                        Erfasse eine neue Saison.
                    </DialogDescription>
                </DialogHeader>
                <form id="saison-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="saison" className="sr-only">
                            Saison
                        </Label>
                        <Input
                            id="saison"
                            name="saison"
                            defaultValue={getAktuelleSaisonString()}
                            required
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="grid flex-1 gap-2">
                            <Label htmlFor="von">Von</Label>
                            <Input
                                id="von"
                                name="von"
                                type="date"
                                defaultValue={new Date().toISOString().split("T")[0]}
                                required
                            />
                        </div>
                        <div className="grid flex-1 gap-2">
                            <Label htmlFor="bis">Bis</Label>
                            <Input id="bis" name="bis" type="date" required/>
                        </div>
                    </div>
                </form>
                <DialogFooter className="sm:justify-start">
                    <Button type="submit" form="saison-form" disabled={isPending}>
                        {isPending ? "Speichern..." : "Speichern"}
                    </Button>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Abbrechen
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}