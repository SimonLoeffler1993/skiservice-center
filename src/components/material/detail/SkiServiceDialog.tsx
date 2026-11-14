"use client";

import { useState, useTransition } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import { zahlAus } from "@/components/material/bearbeiten/FeldDialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { skiservicesPreiseOptions } from "@/hooks/useSkiservicesPreiseOptions";
import { aendereSkiService, erstelleSkiService, loescheSkiService } from "@/lib/materialdetailactions";
import { SkiService } from "@/types/materialdetailtypes";

type SkiServiceDialogProps = {
    skiID: number;
    // Ohne Service wird ein neuer eingetragen
    service?: SkiService;
    // Vorschlag aus den Einstellungen (Abzug je Service)
    abzugStandard: number;
    onGeaendert: () => void;
    // Button, der den Dialog öffnet
    children: React.ReactNode;
};

const alsEingabe = (betrag: number) => betrag.toFixed(2).replace(".", ",");

// Service am Leihski eintragen oder ändern. Der Abzug wird am Service gespeichert
export default function SkiServiceDialog({ skiID, service, abzugStandard, onGeaendert, children }: SkiServiceDialogProps) {
    const [offen, setOffen] = useState(false);
    const [datum, setDatum] = useState("");
    const [bezeichnung, setBezeichnung] = useState("");
    const [abzug, setAbzug] = useState("");
    const [fehler, setFehler] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    // Vorschläge aus der Skiservice-Preisliste, eigener Text bleibt möglich
    const preise = useQuery({ ...skiservicesPreiseOptions, enabled: offen });
    const vorschlaege = preise.data?.success ? preise.data.data.map((preis) => preis.Service) : [];

    function oeffnen(wert: boolean) {
        setOffen(wert);
        setFehler(null);
        if (wert) {
            setDatum(service?.Datum ?? format(new Date(), "yyyy-MM-dd"));
            setBezeichnung(service?.Bezeichnung ?? "");
            setAbzug(alsEingabe(service?.Abzug ?? abzugStandard));
        }
    }

    function fertig() {
        onGeaendert();
        setOffen(false);
    }

    function speichern() {
        const betrag = zahlAus(abzug);
        if (!datum) return setFehler("Bitte ein Datum angeben.");
        if (!bezeichnung.trim()) return setFehler("Bitte angeben, was gemacht wurde.");
        if (betrag === null || Number.isNaN(betrag) || betrag < 0) return setFehler("Der Abzug muss eine Zahl ab 0 sein.");

        startTransition(async () => {
            const daten = { Datum: datum, Bezeichnung: bezeichnung.trim(), Abzug: betrag };
            const antwort = service ? await aendereSkiService(service.ID, daten) : await erstelleSkiService(skiID, daten);
            if (!antwort.success) return setFehler(antwort.error);
            fertig();
        });
    }

    function loeschen() {
        if (!service) return;
        startTransition(async () => {
            const antwort = await loescheSkiService(service.ID);
            if (!antwort.success) return setFehler(antwort.error);
            fertig();
        });
    }

    return (
        <Dialog open={offen} onOpenChange={oeffnen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{service ? "Service ändern" : "Service eintragen"}</DialogTitle>
                    <DialogDescription>Der Abzug wird vom Erwirtschafteten des Skis abgezogen.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="service-datum">Datum</Label>
                        <Input id="service-datum" type="date" value={datum} onChange={(e) => setDatum(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="service-bezeichnung">Service</Label>
                        <Input
                            id="service-bezeichnung"
                            list="service-vorschlaege"
                            maxLength={200}
                            placeholder="z.B. Kanten schleifen und wachsen"
                            value={bezeichnung}
                            onChange={(e) => setBezeichnung(e.target.value)}
                        />
                        <datalist id="service-vorschlaege">
                            {vorschlaege.map((vorschlag) => <option key={vorschlag} value={vorschlag} />)}
                        </datalist>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="service-abzug">Abzug (€)</Label>
                        <Input id="service-abzug" inputMode="decimal" value={abzug} onChange={(e) => setAbzug(e.target.value)} />
                        <p className="text-xs text-muted-foreground">
                            Vorschlag aus den Einstellungen: {alsEingabe(abzugStandard)} €
                        </p>
                    </div>
                    {fehler && <p className="text-sm text-destructive">{fehler}</p>}
                </div>
                <DialogFooter className="sm:justify-between">
                    {service ? (
                        <Button type="button" variant="outline" className="text-destructive" onClick={loeschen} disabled={isPending}>
                            Löschen
                        </Button>
                    ) : <span />}
                    <Button type="button" onClick={speichern} disabled={isPending}>
                        {isPending ? "Speichern..." : "Speichern"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
