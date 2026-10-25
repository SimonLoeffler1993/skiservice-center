"use client";

import { useEffect, useRef } from "react";

/**
 * Für den per QR-Code aufgerufenen Ski bzw. das Material: einmal in die Mitte scrollen.
 * Gibt die Ref für das hervorgehobene Element zurück.
 */
export function useHervorheben<T extends HTMLElement>(aktiv: boolean) {
    const ref = useRef<T>(null);

    useEffect(() => {
        if (aktiv) ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, [aktiv]);

    return ref;
}

// Klassen für die hervorgehobene Karte
export const HERVORGEHOBEN_KLASSE = "ring-2 ring-primary ring-offset-2";
