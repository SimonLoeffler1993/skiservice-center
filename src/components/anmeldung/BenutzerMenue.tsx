"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { LogIn, LogOut, MonitorSmartphone, UserRound, UserRoundCog, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBenutzer } from "@/context/benutzer-context";
import { bedienerAbmelden, geraetAbmelden, holeStatus } from "@/lib/anmeldungactions";
import GeraetAnmeldenDialog from "./GeraetAnmeldenDialog";

/**
 * Angemeldeter Bediener mit „Mein Konto“.
 * Dauerhaft angemeldetes Gerät: Bediener wechseln und Gerät abmelden.
 * Persönliche Anmeldung: Abmelden und, mit Recht, „Gerät anmelden“.
 */
export default function BenutzerMenue() {
    const { benutzer, geraet, darf } = useBenutzer();
    const [dialog, setDialog] = useState(false);
    const dauerhaft = Boolean(geraet?.dauerhaft);
    const kannAnmelden = Boolean(benutzer && geraet && !dauerhaft && darf("geraete.anmelden"));
    const { data: status } = useQuery({ queryKey: ["authStatus"], queryFn: holeStatus, staleTime: 60_000, enabled: kannAnmelden });

    if (!benutzer) {
        return (
            <Button variant="ghost" size="sm" asChild>
                <Link href={geraet?.dauerhaft ? "/anmelden/bediener" : "/anmelden"}>
                    <LogIn /> Anmelden
                </Link>
            </Button>
        );
    }

    const abmelden = async () => {
        const geraetWeg = await bedienerAbmelden();
        window.location.href = geraetWeg ? "/anmelden" : "/anmelden/bediener";
    };
    const geraetWeg = async () => {
        if (!window.confirm("Dieses Gerät abmelden? Danach ist eine neue Anmeldung mit Passwort nötig.")) return;
        await geraetAbmelden();
        window.location.href = "/anmelden";
    };
    const oidcText = status?.success && status.data.oidc.aktiv ? status.data.oidc.button_text : null;

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                        <UserRound />
                        <span className="max-w-32 truncate">{benutzer.anzeigename}</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                        <div className="font-medium">{benutzer.anzeigename}</div>
                        <div className="text-xs text-muted-foreground">
                            {benutzer.gruppen.map((g) => g.name).join(", ") || "ohne Gruppe"}
                            {geraet ? (dauerhaft ? ` · ${geraet.name}` : " · persönlich angemeldet") : ""}
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {dauerhaft && (
                        <DropdownMenuItem onSelect={abmelden}>
                            <Users /> Bediener wechseln
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                        <Link href="/konto"><UserRoundCog /> Mein Konto</Link>
                    </DropdownMenuItem>
                    {kannAnmelden && (
                        <DropdownMenuItem onSelect={() => setDialog(true)}>
                            <MonitorSmartphone /> Gerät anmelden
                        </DropdownMenuItem>
                    )}
                    {dauerhaft && (
                        // Wie „Bediener wechseln“, aber unmissverständlich: die Person meldet sich ab, das Gerät bleibt
                        <DropdownMenuItem onSelect={abmelden}>
                            <LogOut />
                            <span className="flex flex-col">
                                Abmelden
                                <span className="text-xs text-muted-foreground">Gerät bleibt angemeldet</span>
                            </span>
                        </DropdownMenuItem>
                    )}
                    {geraet && (
                        <>
                            <DropdownMenuSeparator />
                            {dauerhaft ? (
                                <DropdownMenuItem onSelect={geraetWeg} variant="destructive">
                                    <LogOut /> Gerät abmelden
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem onSelect={abmelden}>
                                    <LogOut /> Abmelden
                                </DropdownMenuItem>
                            )}
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
            {kannAnmelden && <GeraetAnmeldenDialog key={String(dialog)} offen={dialog} onOffen={setDialog} oidcText={oidcText} />}
        </>
    );
}
