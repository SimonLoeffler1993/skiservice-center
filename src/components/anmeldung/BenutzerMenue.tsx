"use client";

import Link from "next/link";
import { LogIn, LogOut, UserRound, UserRoundCog, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBenutzer } from "@/context/benutzer-context";
import { bedienerAbmelden, geraetAbmelden } from "@/lib/anmeldungactions";

/** Angemeldeter Bediener mit Bedienerwechsel, „Mein Konto“ und Gerät abmelden. */
export default function BenutzerMenue() {
    const { benutzer, geraet } = useBenutzer();

    if (!benutzer) {
        return (
            <Button variant="ghost" size="sm" asChild>
                <Link href={geraet ? "/anmelden/bediener" : "/anmelden"}>
                    <LogIn /> Anmelden
                </Link>
            </Button>
        );
    }

    const wechseln = async () => {
        await bedienerAbmelden();
        window.location.href = "/anmelden/bediener";
    };
    const geraetWeg = async () => {
        if (!window.confirm("Dieses Gerät abmelden? Danach ist eine neue Anmeldung mit Passwort nötig.")) return;
        await geraetAbmelden();
        window.location.href = "/anmelden";
    };

    return (
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
                        {benutzer.gruppen.map((g) => g.name).join(", ") || "ohne Gruppe"}{geraet ? ` · ${geraet.name}` : ""}
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {geraet && (
                    <DropdownMenuItem onSelect={wechseln}>
                        <Users /> Bediener wechseln
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                    <Link href="/konto"><UserRoundCog /> Mein Konto</Link>
                </DropdownMenuItem>
                {geraet && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={geraetWeg} variant="destructive">
                            <LogOut /> Gerät abmelden
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
