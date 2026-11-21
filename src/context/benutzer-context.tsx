"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { bedienerAbmelden, holeIch } from "@/lib/anmeldungactions";
import type { Ich, IchBenutzer, IchGeraet } from "@/types/anmeldung";

type BenutzerKontext = {
    benutzer: IchBenutzer | null;
    geraet: IchGeraet | null;
    // Recht vorhanden? Ohne Anmeldung im Übergang ist alles sichtbar (die API prüft ohnehin selbst)
    darf: (recht: string) => boolean;
    aktualisieren: () => Promise<void>;
};

const Kontext = createContext<BenutzerKontext>({
    benutzer: null, geraet: null, darf: () => true, aktualisieren: async () => {},
});

export function useBenutzer() {
    return useContext(Kontext);
}

// Seiten, auf denen keine Weiterleitung zur Anmeldung passieren darf
function istAnmeldeSeite(pfad: string) {
    return pfad.startsWith("/anmelden") || pfad.startsWith("/einrichtung");
}

// Prüft regelmäßig, ob die Sitzung in der API noch gilt (z.B. vom Admin abgemeldet)
const PRUEF_MS = 60_000;
const AKTIVITAET = ["pointerdown", "keydown", "touchstart", "wheel"] as const;

export function BenutzerProvider({ anfang, sitzung, children }: {
    anfang: Ich;
    // Welche Anmelde-Cookies der Browser mitgeschickt hat
    sitzung: { geraet: boolean; bediener: boolean };
    children: React.ReactNode;
}) {
    const [ich, setIch] = useState<Ich>(anfang);
    const pfad = usePathname();
    const pfadRef = useRef(pfad);
    useEffect(() => {
        pfadRef.current = pfad;
    }, [pfad]);

    const zurBedienerauswahl = useCallback(() => {
        const zurueck = window.location.pathname + window.location.search;
        window.location.href = `/anmelden/bediener?zurueck=${encodeURIComponent(zurueck)}`;
    }, []);

    const aktualisieren = useCallback(async () => {
        const neu = await holeIch();
        setIch((alt) => {
            if (!istAnmeldeSeite(pfadRef.current)) {
                // Bediener weg (Timeout in der API, anderes Gerät, deaktiviert): zur Auswahl bzw. Anmeldung
                if (alt.benutzer && !neu.benutzer) {
                    if (neu.geraet) zurBedienerauswahl();
                    else window.location.href = "/anmelden";
                }
            }
            return neu;
        });
    }, [zurBedienerauswahl]);

    // Cookies, die die API nicht mehr kennt (Gerät vom Admin abgemeldet, Bediener abgelaufen)
    useEffect(() => {
        if (istAnmeldeSeite(pfadRef.current)) return;
        const zurueck = encodeURIComponent(window.location.pathname + window.location.search);
        if ((sitzung.geraet || sitzung.bediener) && !anfang.geraet) {
            window.location.href = `/anmelden/abmelden?zurueck=${zurueck}`;
        } else if (sitzung.bediener && !anfang.benutzer) {
            window.location.href = `/anmelden/bediener?zurueck=${zurueck}`;
        }
    }, [sitzung.geraet, sitzung.bediener, anfang.geraet, anfang.benutzer]);

    // Regelmäßig und beim Zurückkehren zum Tab prüfen
    useEffect(() => {
        if (!ich.geraet) return;
        const timer = window.setInterval(aktualisieren, PRUEF_MS);
        const beiSichtbar = () => {
            if (document.visibilityState === "visible") void aktualisieren();
        };
        document.addEventListener("visibilitychange", beiSichtbar);
        return () => {
            window.clearInterval(timer);
            document.removeEventListener("visibilitychange", beiSichtbar);
        };
    }, [ich.geraet, aktualisieren]);

    // Passwort muss nach dem Anlegen bzw. Zurücksetzen geändert werden
    useEffect(() => {
        if (ich.benutzer?.passwort_aendern && !pfad.startsWith("/konto") && !istAnmeldeSeite(pfad)) {
            window.location.href = "/konto?pflicht=1";
        }
    }, [ich.benutzer?.passwort_aendern, pfad]);

    // Inaktivität: nach der eingestellten Zeit zurück zur Bedienerauswahl (0 = nie)
    const minuten = ich.benutzer && ich.geraet ? ich.geraet.bediener_timeout_minuten : 0;
    useEffect(() => {
        if (!minuten || istAnmeldeSeite(pfad)) return;
        let letzte = Date.now();
        const aktiv = () => {
            letzte = Date.now();
        };
        AKTIVITAET.forEach((art) => window.addEventListener(art, aktiv, { passive: true }));
        const timer = window.setInterval(async () => {
            if (Date.now() - letzte >= minuten * 60_000) {
                window.clearInterval(timer);
                await bedienerAbmelden();
                zurBedienerauswahl();
            }
        }, 5_000);
        return () => {
            window.clearInterval(timer);
            AKTIVITAET.forEach((art) => window.removeEventListener(art, aktiv));
        };
    }, [minuten, pfad, zurBedienerauswahl]);

    const wert: BenutzerKontext = {
        benutzer: ich.benutzer,
        geraet: ich.geraet,
        darf: (recht: string) => !ich.benutzer || ich.benutzer.rechte.includes("*") || ich.benutzer.rechte.includes(recht),
        aktualisieren,
    };
    return <Kontext.Provider value={wert}>{children}</Kontext.Provider>;
}
