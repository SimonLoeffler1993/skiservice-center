"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Schuh, SchuhModellArray } from "@/types/materialtypes";
import { aendereSchuhMaterial } from "@/lib/materialbearbeitenactions";
import FeldDialog, { FeldWerte, zahlAus } from "../bearbeiten/FeldDialog";
import MaterialAktionen, { AusgemustertBadge } from "../bearbeiten/MaterialAktionen";

type SkischuhProps = {
    schuh: Schuh
    modelle: SchuhModellArray
    onGeaendert: () => void
}

export default function SkischuhCard ({schuh, modelle, onGeaendert}: SkischuhProps) {
    const formatEUR = (n: number) =>
        new Intl.NumberFormat("de-AT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n)

    async function speichern(werte: FeldWerte): Promise<string | null> {
        const sohle = zahlAus(werte.Sohle);
        if (sohle !== null && (Number.isNaN(sohle) || !Number.isInteger(sohle) || sohle < 150 || sohle > 400)) {
            return "Sohlenlänge muss eine ganze Zahl zwischen 150 und 400 mm sein.";
        }
        const antwort = await aendereSchuhMaterial(schuh.ID, {
            Modell_ID: Number(werte.Modell_ID),
            // Leer = interne ID als Nummer
            SchuhNr: String(werte.SchuhNr ?? ""),
            Groese: zahlAus(werte.Groese) ?? undefined,
            Sohle: sohle,
            Saison: String(werte.Saison),
            EK: zahlAus(werte.EK) ?? undefined,
            VK: zahlAus(werte.VK) ?? undefined,
        });
        if (!antwort.success) return antwort.error;
        onGeaendert();
        return null;
    }

    const bearbeiten = (
        <FeldDialog
            titel={`Schuh ${schuh.SchuhNr} bearbeiten`}
            startwerte={{
                Modell_ID: String(schuh.Modell_ID),
                SchuhNr: schuh.SchuhNr,
                Groese: String(schuh.Groese),
                Sohle: schuh.Sohle ? String(schuh.Sohle) : "",
                Saison: schuh.Saison,
                EK: String(schuh.EK),
                VK: String(schuh.VK),
            }}
            felder={[
                {
                    name: "Modell_ID", label: "Modell", typ: "auswahl",
                    optionen: modelle.map((m) => ({ wert: String(m.ID), text: `${m.Hersteller.Name} ${m.Modell}${m.Jugend ? " (Jugend)" : ""}` })),
                },
                {
                    name: "SchuhNr", label: "Schuh-Nr.", optional: true,
                    hinweis: `Eigene Nummer, z.B. Inventur-Aufkleber. Leer = interne Nummer ${schuh.ID}.`,
                },
                { name: "Groese", label: "Größe (MP)", typ: "zahl" },
                { name: "Sohle", label: "Sohlenlänge (mm)", typ: "zahl", optional: true },
                { name: "Saison", label: "Saison" },
                { name: "EK", label: "EK (€)", typ: "zahl" },
                { name: "VK", label: "VK (€)", typ: "zahl" },
            ]}
            onSpeichern={speichern}
        />
    );

    return (
        <Card className={`hover:shadow-md transition-shadow ${schuh.Ausgemustert ? "opacity-60" : ""}`}>
            <CardHeader>
                <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-base">
                    {schuh.Modell.Modell}
                    {schuh.Ausgemustert && <AusgemustertBadge />}
                </CardTitle>
                <CardDescription>
                    {schuh.Modell.Hersteller.Name}
                    {schuh.Modell.Jugend && (
                        <span className="ml-2 rounded-md bg-muted px-2 py-1 text-xs">Jugend</span>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Größe</div>
                    <div className="text-right">{schuh.Groese} MP</div>
                    <div className="text-muted-foreground">Sohle</div>
                    <div className="text-right">{schuh.Sohle ? `${schuh.Sohle} mm` : "–"}</div>
                    <div className="text-muted-foreground">Schuh-Nr.</div>
                    <div className="text-right">{schuh.SchuhNr}</div>
                    <div className="text-muted-foreground">EK</div>
                    <div className="text-right">{formatEUR(schuh.EK)}</div>
                    <div className="text-muted-foreground">VK</div>
                    <div className="text-right font-medium">{formatEUR(schuh.VK)}</div>
                </div>
            </CardContent>
            <CardFooter className="flex-wrap justify-between gap-2">
                <div className="text-sm text-muted-foreground">Saison {schuh.Saison}</div>
                <MaterialAktionen
                    art="schuh"
                    id={schuh.ID}
                    bezeichnung={`Schuh ${schuh.SchuhNr}`}
                    ausgemustert={schuh.Ausgemustert}
                    bearbeiten={bearbeiten}
                    onGeaendert={onGeaendert}
                />
            </CardFooter>
        </Card>
    )
};
