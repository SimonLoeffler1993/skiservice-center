import { CalendarDays, Snowflake } from "lucide-react";
import { format, parseISO } from "date-fns";

import { VerleihArt } from "@/types/saisonverleihtypes";

type VerleihArtBadgeProps = {
    art: VerleihArt;
    startAm?: string | null;
    endeAm?: string | null;
};

export default function VerleihArtBadge({ art, startAm, endeAm }: VerleihArtBadgeProps) {
    if (art === "tag") {
        const zeitraum = startAm && endeAm
            ? ` ${format(parseISO(startAm), "dd.MM.")}–${format(parseISO(endeAm), "dd.MM.yyyy")}`
            : "";
        return (
            <span className="inline-flex items-center gap-1 rounded-md border border-sky-200 bg-sky-50 px-2 py-1 text-xs font-medium text-sky-700">
                <CalendarDays className="h-3.5 w-3.5" />
                Tagesverleih{zeitraum}
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium text-muted-foreground">
            <Snowflake className="h-3.5 w-3.5" />
            Saisonverleih
        </span>
    );
}
