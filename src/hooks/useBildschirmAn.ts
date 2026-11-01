"use client";

import { useEffect, useState } from "react";
import NoSleep from "nosleep.js";

// Hält den Bildschirm an, solange die Komponente eingehängt ist (Tablet am Hardware-Scanner).
// Bevorzugt die Screen Wake Lock API, die gibt es aber nur über HTTPS oder localhost.
// Sonst ein unsichtbares Video (nosleep.js), das der Browser erst nach einer Berührung abspielt.
// Gibt zurück, ob der Bildschirm gerade wach gehalten wird.
export function useBildschirmAn(): boolean {
    const [aktiv, setAktiv] = useState(false);

    useEffect(() => {
        let beendet = false;
        let anfrageLaeuft = false;
        let sperre: WakeLockSentinel | null = null;
        // NoSleep nur ohne Wake Lock API, sonst meldet es selbst Sperren an und gibt sie nicht frei
        const video = "wakeLock" in navigator ? null : new NoSleep();

        async function anfordern() {
            if (beendet || anfrageLaeuft || document.visibilityState !== "visible") return;
            if (video ? video.isEnabled : sperre && !sperre.released) return;
            anfrageLaeuft = true;
            try {
                if (video) {
                    await video.enable();
                } else {
                    const neu = await navigator.wakeLock.request("screen");
                    if (beendet) {
                        neu.release();
                        return;
                    }
                    sperre = neu;
                    // Der Browser gibt die Sperre frei, wenn die Seite verdeckt wird
                    neu.addEventListener("release", () => {
                        if (!beendet) setAktiv(false);
                    });
                }
                if (!beendet) setAktiv(true);
            } catch {
                // Ohne Berührung oder ohne Erlaubnis: beim nächsten Tippen erneut versuchen
                if (!beendet) setAktiv(false);
            } finally {
                anfrageLaeuft = false;
            }
        }

        function sichtbarkeit() {
            if (document.visibilityState === "visible") {
                anfordern();
            } else if (video) {
                // Das Video pausiert im Hintergrund, beim Zurückkommen neu starten
                video.disable();
                setAktiv(false);
            }
        }

        anfordern();
        document.addEventListener("visibilitychange", sichtbarkeit);
        document.addEventListener("pointerdown", anfordern);
        return () => {
            beendet = true;
            document.removeEventListener("visibilitychange", sichtbarkeit);
            document.removeEventListener("pointerdown", anfordern);
            sperre?.release();
            video?.disable();
        };
    }, []);

    return aktiv;
}
