import { MailCheck, MailWarning } from "lucide-react";

import { cn } from "@/lib/utils";
import { MailStatus } from "@/types/skiscanner";

type MailHinweisProps = {
    // Ergebnis der automatischen Kundenmail, ohne Wert wird nichts angezeigt
    status: MailStatus | null | undefined;
    // Welche Mail: "Skiservice fertig" bzw. Abhol-Mail vom Verleih
    art: "fertig" | "abholung";
    // Name des Kunden, falls bekannt
    kunde?: string | null;
};

const INHALT = {
    fertig: "Der Skiservice ist fertig",
    abholung: "Der Verleih liegt zur Abholung bereit",
};

// Deutlicher Hinweis beim Scannen, dass der Kunde gerade automatisch eine E-Mail bekommen hat (oder der Versand scheiterte)
export default function MailHinweis({ status, art, kunde }: MailHinweisProps) {
    if (!status) return null;
    const gesendet = status === "gesendet";
    const Icon = gesendet ? MailCheck : MailWarning;
    const empfaenger = kunde ? kunde : "den Kunden";
    return (
        <div
            role="status"
            aria-live="polite"
            className={cn(
                "flex items-center gap-3 rounded-lg border px-3 py-2.5",
                gesendet ? "border-blue-200 bg-blue-50 text-blue-900" : "border-red-300 bg-red-50 text-red-800",
            )}
        >
            <Icon className="h-6 w-6 shrink-0" />
            <div className="min-w-0">
                <p className="font-semibold">{gesendet ? `E-Mail an ${empfaenger} gesendet` : `E-Mail an ${empfaenger} konnte nicht gesendet werden`}</p>
                <p className="text-sm">{gesendet ? `${INHALT[art]}.` : "Bitte anders benachrichtigen, z.B. anrufen."}</p>
            </div>
        </div>
    );
}
