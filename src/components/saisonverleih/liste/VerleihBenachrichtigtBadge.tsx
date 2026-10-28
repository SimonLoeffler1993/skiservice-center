import { format, parseISO } from "date-fns";
import { BellOff, MailCheck, MailWarning, type LucideIcon } from "lucide-react";

import { VerleihBenachrichtigung } from "@/types/saisonverleihtypes";

export const BENACHRICHTIGUNG_ANZEIGE: Record<VerleihBenachrichtigung, { text: string; icon: LucideIcon; farbe: string }> = {
    nein: { text: "Nicht benachrichtigt", icon: BellOff, farbe: "bg-muted text-muted-foreground border-border" },
    abholung: { text: "Zur Abholung benachrichtigt", icon: MailCheck, farbe: "bg-blue-50 text-blue-700 border-blue-200" },
    rueckgabe: { text: "Zur Rückgabe benachrichtigt", icon: MailWarning, farbe: "bg-amber-50 text-amber-700 border-amber-200" },
};

type VerleihBenachrichtigtBadgeProps = {
    benachrichtigt: VerleihBenachrichtigung;
    am?: string | null;
};

// Benachrichtigung des Kunden: nicht, zur Abholung oder zur Rückgabe
export default function VerleihBenachrichtigtBadge({ benachrichtigt, am }: VerleihBenachrichtigtBadgeProps) {
    const { text, icon: Icon, farbe } = BENACHRICHTIGUNG_ANZEIGE[benachrichtigt];
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium ${farbe}`}
            title={am ? `${text} am ${format(parseISO(am), "dd.MM.yyyy")}` : text}
        >
            <Icon className="h-3.5 w-3.5" />
            {text}
        </span>
    );
}
