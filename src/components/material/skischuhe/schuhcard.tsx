"use client"
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Schuh, SchuhModellArray } from "@/types/materialtypes";
import { formatMaterialEUR } from "../skiBearbeiten";
import { useSchuhBearbeiten } from "./schuhBearbeiten";
import MaterialAktionen, { AusgemustertBadge } from "../bearbeiten/MaterialAktionen";

type SkischuhProps = {
    schuh: Schuh
    modelle: SchuhModellArray
    onGeaendert: () => void
}

export default function SkischuhCard ({schuh, modelle, onGeaendert}: SkischuhProps) {
    const { bearbeiten } = useSchuhBearbeiten(schuh, modelle, onGeaendert);
    const formatEUR = formatMaterialEUR;

    return (
        <Card className={`hover:shadow-md transition-shadow ${schuh.Ausgemustert ? "opacity-60" : ""}`}>
            <CardHeader>
                <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-base">
                    {/* Kopf führt zur Detailseite mit Verleihen und Erwirtschaftetem */}
                    <Link href={`/material/schuh/${schuh.ID}`} className="group inline-flex min-w-0 items-center gap-1 hover:underline" title="Details anzeigen">
                        <span className="truncate">{schuh.Modell.Modell}</span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </Link>
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
