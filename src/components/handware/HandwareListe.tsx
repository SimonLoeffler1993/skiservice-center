"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Search } from "lucide-react";

import LoeschenDialog from "@/components/bearbeiten/LoeschenDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { handwareOptions } from "@/hooks/useHandwareOptions";
import { aendereHandware, legeHandwareAn, loescheHandware } from "@/lib/handwareactions";
import { euro } from "@/lib/utils";
import { HandwareDaten } from "@/types/handwaretypes";
import { ApiAntwort } from "@/types/actiontypes";
import HandwareDialog from "./HandwareDialog";

export default function HandwareListe() {
    const { data, isLoading, error } = useQuery(handwareOptions);
    const queryClient = useQueryClient();
    const [suche, setSuche] = useState("");

    if (isLoading) return <p>Artikel werden geladen...</p>;
    if (error) return <p>Fehler beim Laden der Artikel: {error.message}</p>;
    if (!data?.success) return <p>Artikel konnten nicht geladen werden</p>;

    const kategorien = [...new Set(data.data.map((a) => a.Kategorie).filter((k): k is string => !!k))].sort();
    const begriff = suche.trim().toLowerCase();
    const artikel = begriff
        ? data.data.filter((a) => a.Name.toLowerCase().includes(begriff) || a.Kategorie?.toLowerCase().includes(begriff))
        : data.data;

    // Speichern und danach die Liste neu laden
    async function speichern(aktion: () => Promise<ApiAntwort<unknown>>): Promise<string | null> {
        const antwort = await aktion();
        if (!antwort.success) return antwort.error;
        queryClient.invalidateQueries(handwareOptions);
        return null;
    }

    return (
        <Card>
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>Artikel ({data.data.length})</CardTitle>
                <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-8 sm:w-64" placeholder="Name oder Kategorie suchen" value={suche} onChange={(e) => setSuche(e.target.value)} />
                    </div>
                    <HandwareDialog
                        kategorien={kategorien}
                        trigger={<Button><Plus className="h-4 w-4" />Neuer Artikel</Button>}
                        onSpeichern={(daten: HandwareDaten) => speichern(() => legeHandwareAn(daten))}
                    />
                </div>
            </CardHeader>
            <CardContent>
                {artikel.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{begriff ? "Kein Artikel gefunden." : "Noch keine Artikel erfasst."}</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Kategorie</TableHead>
                                <TableHead className="hidden md:table-cell">Beschreibung</TableHead>
                                <TableHead className="text-right">Anzahl</TableHead>
                                <TableHead className="text-right">Preis</TableHead>
                                <TableHead className="w-28 text-right">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {artikel.map((a) => (
                                <TableRow key={a.ID}>
                                    <TableCell className="font-medium">{a.Name}</TableCell>
                                    <TableCell>{a.Kategorie ?? <span className="text-muted-foreground">–</span>}</TableCell>
                                    <TableCell className="hidden max-w-xs truncate text-muted-foreground md:table-cell" title={a.Beschreibung ?? undefined}>
                                        {a.Beschreibung}
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums">
                                        {a.Anzahl == null ? (
                                            <span className="text-muted-foreground">–</span>
                                        ) : (
                                            // Leer oder im Minus: Hinweis zum Nachbestellen
                                            <span className={a.Anzahl <= 0 ? "font-medium text-orange-600" : ""}>{a.Anzahl}</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums">{euro.format(a.Preis)}</TableCell>
                                    <TableCell className="text-right">
                                        <span className="inline-flex gap-1">
                                            <HandwareDialog
                                                artikel={a}
                                                kategorien={kategorien}
                                                trigger={<Button type="button" variant="ghost" size="icon" title="Bearbeiten"><Pencil className="h-4 w-4" /></Button>}
                                                onSpeichern={(daten) => speichern(() => aendereHandware(a.ID, daten))}
                                            />
                                            <LoeschenDialog
                                                titel={`${a.Name} löschen`}
                                                beschreibung="Der Artikel wird gelöscht. Bereits erstellte Quittungen bleiben unverändert."
                                                onLoeschen={() => speichern(() => loescheHandware(a.ID))}
                                            />
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
