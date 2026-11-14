"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBackendUrl } from "@/context/backend-context";

import { SCANNER_MODI, webflasherUrl } from "./webflasherUrl";

// Reihenfolge wie im Webflasher
const MODUS_REIHENFOLGE = [1, 2, 0];

// Öffnet den Webflasher mit vorbelegter Server-Adresse, Name und Modus. Das WLAN wird dort eingetragen.
export default function ScannerEinrichtung({ webflasherUrl: webflasher, startName = "" }: { webflasherUrl: string; startName?: string }) {
    const backendUrl = useBackendUrl();
    const [name, setName] = useState(startName);
    const [modus, setModus] = useState(1);

    // Der Scanner spricht dieselbe API wie das Center (BACKEND_URL)
    const server = backendUrl;
    // Der Scanner hängt im WLAN, localhost wäre er selbst
    const nurLokal = /^https?:\/\/(localhost|127\.|\[::1\])/i.test(server);

    return (
        <Card id="hardware-scanner" className="scroll-mt-20">
            <CardHeader>
                <CardTitle>Hardware-Scanner installieren</CardTitle>
                <CardDescription>
                    Öffnet den Webflasher, Server-Adresse, Name und Modus sind dort schon eingetragen. Nur das WLAN wird im Webflasher ergänzt.
                    Dafür Chrome oder Edge am Computer verwenden und den Scanner über den COM-Port anschließen.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="scanner-name">Name des Scanners</Label>
                        <Input id="scanner-name" value={name} placeholder="z.B. Werkstatt" onChange={(event) => setName(event.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="scanner-modus">Modus</Label>
                        <Select value={String(modus)} onValueChange={(wert) => setModus(Number(wert))}>
                            <SelectTrigger id="scanner-modus" className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {MODUS_REIHENFOLGE.map((wert) => (
                                    <SelectItem key={wert} value={String(wert)}>{SCANNER_MODI[wert]}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <p className="text-sm text-muted-foreground">
                    Server-Adresse für den Scanner: <span className="font-mono text-xs text-foreground">{server}</span>
                </p>
                {nurLokal && (
                    <p className="text-sm text-destructive">
                        Diese Adresse erreicht der Scanner im WLAN nicht. Das Center braucht als BACKEND_URL eine Adresse, die im Netzwerk erreichbar ist, oder die Server-Adresse wird im Webflasher angepasst.
                    </p>
                )}

                <Button variant="outline" asChild>
                    <a href={webflasherUrl(webflasher, { server, name, modus })} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" /> Webflasher öffnen
                    </a>
                </Button>
            </CardContent>
        </Card>
    );
}
