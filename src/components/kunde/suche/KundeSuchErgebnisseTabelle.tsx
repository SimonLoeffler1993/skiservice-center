"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Kunde } from "@/types/skikundentypes";
import { useSkikundenContext } from "@/context/skikunden-context";

type KundeSuchErgebnisseTabelleProps = {
    daten: Kunde[] | null;
    onKundeAuswaehlen?: (kunde: Kunde) => void;
};

export default function KundeSuchErgebnisseTabelle({ daten, onKundeAuswaehlen }: KundeSuchErgebnisseTabelleProps) {
    const { setKunde } = useSkikundenContext();
    if (!daten || daten.length === 0) {
        return <p className="text-sm text-muted-foreground mt-4">Keine Ergebnisse gefunden...</p>;
    }

    return (
        <Card className="mt-6">
            <CardContent>
                <Table>
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Vorname</TableHead>
                            <TableHead>Nachname</TableHead>
                            <TableHead>E-Mail</TableHead>
                            <TableHead>Telefon</TableHead>
                            <TableHead>Aktion</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {daten.map((kunde) => (
                            <TableRow key={kunde.ID}>
                                <TableCell>{kunde.Vorname}</TableCell>
                                <TableCell>{kunde.Nachname}</TableCell>
                                <TableCell>{kunde.Email ?? "-"}</TableCell>
                                <TableCell>{kunde.Tel ?? "-"}</TableCell>
                                <TableCell>
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() =>  {
                                            setKunde(kunde);
                                            onKundeAuswaehlen?.(kunde);
                                        }}
                                    >
                                        Kunde auswählen
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
