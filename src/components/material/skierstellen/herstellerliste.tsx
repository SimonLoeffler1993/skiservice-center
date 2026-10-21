"use client"
import { startTransition, use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSkiHerstellerContext } from "@/context/skihersteller-context"
import { useSkiModellContext } from "@/context/skimodell-context"
import { useEigenSkiContext } from "@/context/eigenski-context"
import { aendereHersteller } from "@/lib/materialbearbeitenactions"
import FeldDialog from "../bearbeiten/FeldDialog"
import StammdatenLoeschenDialog from "../bearbeiten/StammdatenLoeschenDialog"

export default function Herstellerliste() {
    const { herstellerPromise, refreshHerstellerPromise } = useSkiHerstellerContext();
    const { refreshModellPromise } = useSkiModellContext();
    const { refreshEigenSkisPromise } = useEigenSkiContext();
    const hersteller = use(herstellerPromise);

    // Herstellernamen stehen auch bei Modellen und Ski, deshalb alles neu laden
    function neuLaden() {
        startTransition(() => {
            refreshHerstellerPromise();
            refreshModellPromise();
            refreshEigenSkisPromise();
        });
    }
    // TODO: Suche
    return (
        <Card className="m-2">
            <CardHeader>
                <CardTitle>Ski Hersteller</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* <Input placeholder="Suchen…" aria-label="Hersteller suchen" /> */}

                    <ul className="divide-y rounded-md border">
                        {hersteller.map((hersteller) => (
                            <li key={hersteller.ID} className="flex items-center justify-between gap-4 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted font-semibold">
                                        {hersteller.Name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium">{hersteller.Name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FeldDialog
                                        titel={`Hersteller ${hersteller.Name} bearbeiten`}
                                        startwerte={{ Name: hersteller.Name }}
                                        felder={[{ name: "Name", label: "Name" }]}
                                        onSpeichern={async (werte) => {
                                            const antwort = await aendereHersteller("skihersteller", hersteller.ID, String(werte.Name));
                                            if (!antwort.success) return antwort.error;
                                            neuLaden();
                                            return null;
                                        }}
                                    />
                                    <StammdatenLoeschenDialog
                                        art="skihersteller"
                                        id={hersteller.ID}
                                        bezeichnung={`Hersteller ${hersteller.Name}`}
                                        verweis={["Modell", "Modellen"]}
                                        onGeloescht={neuLaden}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}