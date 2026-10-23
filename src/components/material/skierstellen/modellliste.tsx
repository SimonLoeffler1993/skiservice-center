"use client"
import { startTransition, use } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSkiModellContext } from "@/context/skimodell-context"
import { useSkiHerstellerContext } from "@/context/skihersteller-context"
import { useSkiArtContext } from "@/context/skiart-context"
import { useEigenSkiContext } from "@/context/eigenski-context"
import { aendereSkiModell } from "@/lib/materialbearbeitenactions"
import FeldDialog from "../bearbeiten/FeldDialog"
import StammdatenLoeschenDialog from "../bearbeiten/StammdatenLoeschenDialog"

export default function SkiModellliste() {
    const { modellPromise, refreshModellPromise } = useSkiModellContext();
    const { herstellerPromise } = useSkiHerstellerContext();
    const { artPromise } = useSkiArtContext();
    const { refreshEigenSkisPromise } = useEigenSkiContext();
    const modell = use(modellPromise);
    const hersteller = use(herstellerPromise);
    const arten = use(artPromise);

    // Modellnamen stehen auch bei den Ski
    function neuLaden() {
        startTransition(() => {
            refreshModellPromise();
            refreshEigenSkisPromise();
        });
    }

    return (
        <Card className="mx-auto mt-6 max-w-4xl">
            <CardHeader>
                <CardTitle>Vorhandene Modelle</CardTitle>
            </CardHeader>
            <CardContent>
                <span className="text-sm text-muted-foreground">gefunden: {modell.length}</span>
                <ul className="divide-y rounded-md border">
                    {modell.map((modell) => (
                        <li key={modell.ID} className="flex items-center justify-between gap-4 p-4">
                            <div>
                                <p className="font-medium">{modell.Modell}</p>
                                <p className="text-sm text-muted-foreground">Hersteller: {modell.Hersteller.Name}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="rounded-md bg-muted px-2 py-1 text-xs">{modell.Art.Art}</span>
                                <FeldDialog
                                    titel={`Modell ${modell.Modell} bearbeiten`}
                                    startwerte={{ Modell: modell.Modell, Hersteller_ID: String(modell.Hersteller_ID), Art_ID: String(modell.Art_ID) }}
                                    felder={[
                                        { name: "Modell", label: "Modell" },
                                        { name: "Hersteller_ID", label: "Hersteller", typ: "auswahl", optionen: hersteller.map((h) => ({ wert: String(h.ID), text: h.Name })) },
                                        { name: "Art_ID", label: "Art", typ: "auswahl", optionen: arten.map((a) => ({ wert: String(a.ID), text: a.Art })) },
                                    ]}
                                    onSpeichern={async (werte) => {
                                        const antwort = await aendereSkiModell(modell.ID, {
                                            Modell: String(werte.Modell),
                                            Hersteller_ID: Number(werte.Hersteller_ID),
                                            Art_ID: Number(werte.Art_ID),
                                        });
                                        if (!antwort.success) return antwort.error;
                                        neuLaden();
                                        return null;
                                    }}
                                />
                                <StammdatenLoeschenDialog
                                    art="skimodell"
                                    id={modell.ID}
                                    bezeichnung={`Modell ${modell.Modell}`}
                                    verweis={["Ski", "Ski"]}
                                    onGeloescht={neuLaden}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}
