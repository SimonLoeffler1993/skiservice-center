"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mailvorlagenOptions } from "@/hooks/useMailvorlagenOptions";
import VorlageBearbeiten from "./VorlageBearbeiten";

export default function VorlagenSeite() {
    const { data, isPending, isError, error } = useQuery(mailvorlagenOptions);
    const [gewaehlt, setGewaehlt] = useState<string | null>(null);
    const [ungespeichert, setUngespeichert] = useState(false);
    // Vorlage, zu der gewechselt werden soll, solange noch ungespeicherte Änderungen offen sind
    const [wechselZu, setWechselZu] = useState<string | null>(null);

    if (isPending) return <p className="text-muted-foreground">Lade Vorlagen...</p>;
    if (isError) return <p className="text-destructive">{error?.message || "Vorlagen konnten nicht geladen werden."}</p>;

    const aktiv = gewaehlt ?? data[0]?.schluessel ?? "";

    function wechseln(schluessel: string) {
        if (ungespeichert) {
            setWechselZu(schluessel);
        } else {
            setGewaehlt(schluessel);
        }
    }

    function wechselBestaetigen() {
        setGewaehlt(wechselZu);
        setUngespeichert(false);
        setWechselZu(null);
    }

    return (
        <div className="space-y-4">
            <div className="rounded-md border bg-muted/30 p-4 text-sm leading-relaxed">
                <p>
                    Hier stehen die Texte der E-Mails, die an Kunden gehen. Einfach in den Text klicken und schreiben, rechts ist sofort zu sehen, wie die Mail aussieht.
                </p>
                <p className="mt-2">
                    <span className="rounded bg-sky-100 px-1.5 py-0.5 font-medium text-sky-900">Blaue Marken</span> sind Platzhalter:
                    dort steht später z.B. der Name des Kunden.{" "}
                    <span className="rounded border border-dashed border-amber-400 bg-amber-50 px-1.5 py-0.5 font-medium text-amber-900">Gelbe Kästen</span> sind
                    Bausteine: dort erscheint eine fertige Tabelle. Beide lassen sich über die Knöpfe rechts oben einfügen und mit der Löschtaste entfernen.
                </p>
                <p className="mt-2">Es kann nichts kaputtgehen: Jede Vorlage lässt sich jederzeit auf den Originaltext zurücksetzen.</p>
            </div>

            <Tabs value={aktiv} onValueChange={wechseln} className="gap-4">
                {/* Auf kleinen Bildschirmen seitlich scrollbar */}
                <div className="overflow-x-auto">
                    <TabsList>
                        {data.map((vorlage) => (
                            <TabsTrigger key={vorlage.schluessel} value={vorlage.schluessel}>
                                {vorlage.bezeichnung}
                                {vorlage.geaendert && <Badge variant="secondary">geändert</Badge>}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>
                {data.map((vorlage) => (
                    <TabsContent key={vorlage.schluessel} value={vorlage.schluessel}>
                        <VorlageBearbeiten vorlage={vorlage} onUngespeichert={setUngespeichert} />
                    </TabsContent>
                ))}
            </Tabs>

            <Dialog open={wechselZu !== null} onOpenChange={(offen) => !offen && setWechselZu(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Änderungen nicht gespeichert</DialogTitle>
                        <DialogDescription>
                            Die Änderungen an dieser Vorlage sind noch nicht gespeichert. Beim Wechsel zu einer anderen Vorlage gehen sie verloren.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setWechselZu(null)}>Hier bleiben</Button>
                        <Button type="button" variant="destructive" onClick={wechselBestaetigen}>Änderungen verwerfen</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
