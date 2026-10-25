"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Camera, ImageUp, Loader2, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { qrAusCanvas, qrAusDatei } from "./qrAuswerten";

type KameraVorschauProps = {
    // Gefundener QR-Inhalt, danach stoppt die Kamera (Komponente wird ausgeblendet)
    onTreffer: (text: string) => void;
};

function liveMoeglich() {
    return window.isSecureContext && !!navigator.mediaDevices?.getUserMedia;
}

const keinAbo = () => () => {};

/**
 * Live-Kamera mit QR-Erkennung (nur über HTTPS bzw. localhost) und immer zusätzlich
 * "QR-Code fotografieren" über die Kamera-App des Geräts, das funktioniert auch über HTTP.
 */
export default function KameraVorschau({ onTreffer }: KameraVorschauProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const dateiRef = useRef<HTMLInputElement>(null);
    // Auf dem Server immer false, im Browser je nach HTTPS
    const live = useSyncExternalStore(keinAbo, liveMoeglich, () => false);
    const [kameraFehler, setKameraFehler] = useState<string | null>(null);
    const [laeuft, setLaeuft] = useState(false);
    const [fotoPruefen, setFotoPruefen] = useState(false);
    const [fotoFehler, setFotoFehler] = useState<string | null>(null);
    // Aktuellen Callback merken, ohne die Kamera neu zu starten
    const trefferRef = useRef(onTreffer);
    useEffect(() => {
        trefferRef.current = onTreffer;
    }, [onTreffer]);

    useEffect(() => {
        if (!live) return;
        let stream: MediaStream | null = null;
        let frame = 0;
        let beendet = false;
        let letzterVersuch = 0;
        const canvas = document.createElement("canvas");

        function suchen(zeit: number) {
            if (beendet) return;
            const video = videoRef.current;
            // Etwa 6 Versuche pro Sekunde reichen und schonen den Akku
            if (video && video.readyState >= 2 && zeit - letzterVersuch > 160) {
                letzterVersuch = zeit;
                const text = qrAusCanvas(video, video.videoWidth, video.videoHeight, canvas, 720);
                if (text) {
                    trefferRef.current(text);
                    return;
                }
            }
            frame = requestAnimationFrame(suchen);
        }

        navigator.mediaDevices
            .getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false })
            .then(async (neuerStream) => {
                if (beendet) {
                    neuerStream.getTracks().forEach((track) => track.stop());
                    return;
                }
                stream = neuerStream;
                const video = videoRef.current;
                if (!video) return;
                video.srcObject = neuerStream;
                await video.play();
                setLaeuft(true);
                frame = requestAnimationFrame(suchen);
            })
            .catch((fehler: DOMException) => {
                setKameraFehler(
                    fehler.name === "NotAllowedError"
                        ? "Kamerazugriff wurde verweigert. Bitte in den Browser-Einstellungen erlauben oder ein Foto aufnehmen."
                        : "Kamera konnte nicht gestartet werden. Bitte ein Foto aufnehmen.",
                );
            });

        return () => {
            beendet = true;
            cancelAnimationFrame(frame);
            stream?.getTracks().forEach((track) => track.stop());
        };
    }, [live]);

    async function fotoAuswerten(datei: File | undefined) {
        if (!datei) return;
        setFotoPruefen(true);
        setFotoFehler(null);
        try {
            const text = await qrAusDatei(datei);
            if (text) onTreffer(text);
            else setFotoFehler("Kein QR-Code im Foto gefunden. Bitte näher heran und scharf fotografieren.");
        } catch {
            setFotoFehler("Foto konnte nicht gelesen werden.");
        } finally {
            setFotoPruefen(false);
            if (dateiRef.current) dateiRef.current.value = "";
        }
    }

    return (
        <div className="space-y-3">
            {live && !kameraFehler && (
                <div className="relative aspect-[4/3] max-h-[40vh] w-full overflow-hidden rounded-xl bg-black lg:max-h-none">
                    <video ref={videoRef} className="h-full w-full object-cover" playsInline muted />
                    {/* Zielrahmen */}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <div className="aspect-square w-1/2 rounded-2xl border-4 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
                    </div>
                    {!laeuft && (
                        <div className="absolute inset-0 flex items-center justify-center gap-2 text-sm text-white">
                            <Loader2 className="h-4 w-4 animate-spin" /> Kamera wird gestartet...
                        </div>
                    )}
                </div>
            )}

            {!live && (
                <p className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                    <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                    Live-Scan geht nur über HTTPS. Mit „QR-Code fotografieren“ öffnet sich die Kamera des Geräts.
                </p>
            )}
            {kameraFehler && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{kameraFehler}</p>}

            <input
                ref={dateiRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                aria-label="QR-Code fotografieren"
                onChange={(e) => fotoAuswerten(e.target.files?.[0])}
            />
            <Button
                type="button"
                variant={live && !kameraFehler ? "outline" : "default"}
                className="h-12 w-full text-base"
                onClick={() => dateiRef.current?.click()}
                disabled={fotoPruefen}
            >
                {fotoPruefen ? <Loader2 className="h-5 w-5 animate-spin" /> : live && !kameraFehler ? <ImageUp className="h-5 w-5" /> : <Camera className="h-5 w-5" />}
                {fotoPruefen ? "Foto wird ausgewertet..." : "QR-Code fotografieren"}
            </Button>
            {fotoFehler && <p className="text-sm text-red-700">{fotoFehler}</p>}
        </div>
    );
}
