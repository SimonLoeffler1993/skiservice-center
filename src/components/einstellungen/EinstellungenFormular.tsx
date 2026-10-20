"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { einstellungenOptions } from "@/hooks/useEinstellungenOptions";
import { loescheGeheimnis, speichereEinstellungen, TestArt } from "@/lib/einstellungenactions";
import { EinstellungenListe, EinstellungenWerte } from "@/types/einstellungentypes";
import EinstellungFeld from "./EinstellungFeld";
import EinstellungTest from "./EinstellungTest";

// Gruppen mit Test-Funktion
const GRUPPEN_TEST: Record<string, TestArt> = {
    mail: "mail",
    drucker: "drucker",
    lexware: "lexware",
};

function zuFormularWerten(liste: EinstellungenListe): EinstellungenWerte {
    // Passwörter starten immer leer
    return Object.fromEntries(liste.map((e) => [e.schluessel, e.typ === "passwort" ? "" : e.wert]));
}

export default function EinstellungenFormular() {
    const queryClient = useQueryClient();
    const { data, error, isPending: laedt } = useQuery(einstellungenOptions);
    const [isPending, startTransition] = useTransition();
    const [meldung, setMeldung] = useState<{ erfolg: boolean; text: string } | null>(null);

    const { register, control, handleSubmit, reset, setValue, formState: { isDirty, dirtyFields } } = useForm<EinstellungenWerte>();

    // Formular mit den geladenen Werten füllen
    useEffect(() => {
        if (data) reset(zuFormularWerten(data));
    }, [data, reset]);

    const gruppen = useMemo(() => {
        const ergebnis = new Map<string, { bezeichnung: string; einstellungen: EinstellungenListe }>();
        for (const einstellung of data ?? []) {
            if (!ergebnis.has(einstellung.gruppe)) {
                ergebnis.set(einstellung.gruppe, { bezeichnung: einstellung.gruppe_bezeichnung, einstellungen: [] });
            }
            ergebnis.get(einstellung.gruppe)!.einstellungen.push(einstellung);
        }
        return [...ergebnis.entries()];
    }, [data]);

    function nachSpeichern(antwort: Awaited<ReturnType<typeof speichereEinstellungen>>, text: string) {
        if (antwort.success) {
            queryClient.setQueryData(einstellungenOptions.queryKey, antwort.data);
            reset(zuFormularWerten(antwort.data));
            setMeldung({ erfolg: true, text });
        } else {
            setMeldung({ erfolg: false, text: antwort.error });
        }
    }

    function onSubmit(werte: EinstellungenWerte) {
        // Nur geänderte Felder senden
        const geaendert = Object.fromEntries(
            Object.entries(werte).filter(([schluessel]) => dirtyFields[schluessel])
        );
        startTransition(async () => {
            nachSpeichern(await speichereEinstellungen(geaendert), "Einstellungen gespeichert.");
        });
    }

    function onGeheimnisLoeschen(schluessel: string) {
        startTransition(async () => {
            nachSpeichern(await loescheGeheimnis(schluessel), "Wert gelöscht.");
        });
    }

    if (laedt) {
        return <p className="text-muted-foreground">Lade Einstellungen...</p>;
    }
    if (error || !data) {
        return <p className="text-destructive">{error?.message ?? "Einstellungen konnten nicht geladen werden."}</p>;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Tabs defaultValue={gruppen[0]?.[0]} className="w-full">
                {/* Auf kleinen Bildschirmen horizontal scrollbar */}
                <div className="overflow-x-auto">
                    <TabsList>
                        {gruppen.map(([gruppe, { bezeichnung }]) => (
                            <TabsTrigger key={gruppe} value={gruppe}>{bezeichnung}</TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {gruppen.map(([gruppe, { bezeichnung, einstellungen }]) => (
                    <TabsContent key={gruppe} value={gruppe}>
                        <Card>
                            <CardHeader>
                                <CardTitle>{bezeichnung}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FieldGroup className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {einstellungen.map((einstellung) => (
                                        <EinstellungFeld
                                            key={einstellung.schluessel}
                                            einstellung={einstellung}
                                            control={control}
                                            register={register}
                                            setValue={setValue}
                                            onGeheimnisLoeschen={onGeheimnisLoeschen}
                                        />
                                    ))}
                                </FieldGroup>
                                {GRUPPEN_TEST[gruppe] && (
                                    <EinstellungTest art={GRUPPEN_TEST[gruppe]} hatAenderungen={isDirty} />
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Button type="submit" disabled={isPending || !isDirty}>
                    {isPending ? "Speichern..." : "Speichern"}
                </Button>
                <Button type="button" variant="outline" disabled={isPending || !isDirty} onClick={() => reset()}>
                    Verwerfen
                </Button>
                {meldung && (
                    <p className={meldung.erfolg ? "text-sm text-green-700" : "text-sm text-destructive"}>{meldung.text}</p>
                )}
            </div>
        </form>
    );
}
