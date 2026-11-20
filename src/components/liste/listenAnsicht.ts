"use client";

import { useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { z } from "zod";

// Auftrags-, Verleih- und Materialliste gibt es als Kacheln oder als Liste (?ansicht=liste, Kacheln stehen nicht in der URL)
export const ListenAnsichtSchema = z.enum(["kacheln", "liste"]);
export type ListenAnsicht = z.infer<typeof ListenAnsichtSchema>;

export const ANSICHT_PARAMETER = "ansicht";

// Ein Schlüssel für alle Listen
const SPEICHER_SCHLUESSEL = "listen-ansicht";
const EREIGNIS = "listen-ansicht";

function lesen(): ListenAnsicht | null {
    try {
        return ListenAnsichtSchema.safeParse(localStorage.getItem(SPEICHER_SCHLUESSEL)).data ?? null;
    } catch {
        return null;
    }
}

function abonnieren(neu: () => void) {
    window.addEventListener("storage", neu);
    window.addEventListener(EREIGNIS, neu);
    return () => {
        window.removeEventListener("storage", neu);
        window.removeEventListener(EREIGNIS, neu);
    };
}

// Im Browser gemerkte Ansicht, null = noch nie gewählt
export function useGemerkteAnsicht(): ListenAnsicht | null {
    return useSyncExternalStore(abonnieren, lesen, () => null);
}

export function ansichtMerken(ansicht: ListenAnsicht) {
    try {
        localStorage.setItem(SPEICHER_SCHLUESSEL, ansicht);
    } catch {
        // Ohne Speicher gilt die Wahl nur über die URL
    }
    window.dispatchEvent(new Event(EREIGNIS));
}

// Adresse mit der Ansicht setzen, ohne die Seite neu vom Server zu laden. Andere Parameter bleiben erhalten
export function ansichtInUrl(ansicht: ListenAnsicht) {
    const parameter = new URLSearchParams(window.location.search);
    if (ansicht === "kacheln") parameter.delete(ANSICHT_PARAMETER);
    else parameter.set(ANSICHT_PARAMETER, ansicht);
    const query = parameter.toString();
    window.history.replaceState(null, "", query ? `${window.location.pathname}?${query}` : window.location.pathname);
}

// Gültige Ansicht: URL vor gemerkter Wahl, sonst Kacheln
export function useListenAnsicht(): ListenAnsicht {
    const searchParams = useSearchParams();
    const gemerkt = useGemerkteAnsicht();
    const ausUrl = ListenAnsichtSchema.safeParse(searchParams.get(ANSICHT_PARAMETER)).data;
    return ausUrl ?? gemerkt ?? "kacheln";
}
