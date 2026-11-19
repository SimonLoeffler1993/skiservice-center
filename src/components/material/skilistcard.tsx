"use client"
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ModellArray, Ski } from "@/types/materialtypes";
import { formatMaterialEUR, useSkiBearbeiten } from "./skiBearbeiten";
import MaterialAktionen, { AusgemustertBadge } from "./bearbeiten/MaterialAktionen";

type SkiLIstCardProps = {
    ski: Ski
    modelle: ModellArray
    onGeaendert: () => void
}

export default function SkiListCard({ ski, modelle, onGeaendert }: SkiLIstCardProps) {
    const { bearbeiten, meldung } = useSkiBearbeiten(ski, modelle, onGeaendert);
    const formatEUR = formatMaterialEUR;

    return (
        <Card className={`hover:shadow-md transition-shadow ${ski.Ausgemustert ? "opacity-60" : ""}`}>
            <CardHeader>
                <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-base">
                    {/* Kopf führt zur Detailseite mit Verleihen und Erwirtschaftetem */}
                    <Link href={`/material/ski/${ski.ID}`} className="group inline-flex min-w-0 items-center gap-1 hover:underline" title="Details anzeigen">
                        <span className="truncate">{ski.Modell.Modell}</span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </Link>
                    {ski.Ausgemustert && <AusgemustertBadge />}
                </CardTitle>
                <CardDescription>{ski.Modell.Hersteller.Name} • {ski.Modell.Art.Art}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Länge</div>
                    <div className="text-right">{ski.Laenge} cm</div>
                    <div className="text-muted-foreground">Ski-Nr.</div>
                    <div className="text-right">{ski.SkiNr}</div>
                    <div className="text-muted-foreground">EK</div>
                    <div className="text-right">{formatEUR(ski.EK)}</div>
                    <div className="text-muted-foreground">VK</div>
                    <div className="text-right font-medium">{formatEUR(ski.VK)}</div>
                </div>
                {meldung && <p className="text-xs text-green-700">{meldung}</p>}
            </CardContent>
            <CardFooter className="flex-wrap justify-between gap-2">
                <div className="text-sm text-muted-foreground">Saison {ski.Saison}</div>
                <MaterialAktionen
                    art="ski"
                    id={ski.ID}
                    bezeichnung={`Ski ${ski.SkiNr}`}
                    ausgemustert={ski.Ausgemustert}
                    bearbeiten={bearbeiten}
                    onGeaendert={onGeaendert}
                />
            </CardFooter>
        </Card>
    )
}
