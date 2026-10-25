import { format } from "date-fns";
import { de } from "date-fns/locale";

import { cn } from "@/lib/utils";

type FertigBisInfo = {
    // z.B. "Fr 31. Okt 2026"
    datum: string;
    // z.B. "Fr 31. Okt"
    kurz: string;
    // "heute", "3 Tage verbleibend", "2 Tage überfällig"
    rest: string;
    // Klasse für bald fällige (amber) bzw. überfällige (rot) Aufträge
    warnung?: string;
};

// Fertig-bis-Datum ("TT.MM.JJJJ" oder ISO) auswerten, null ohne bzw. mit ungültigem Datum
export function fertigBisInfo(fertigBis: string | null | undefined): FertigBisInfo | null {
    if (!fertigBis) return null;

    const normalizedDate = fertigBis.trim();
    const parsedDate = normalizedDate.includes('.')
        ? new Date(normalizedDate.split('.').reverse().join('-'))
        : new Date(normalizedDate);
    if (Number.isNaN(parsedDate.getTime())) return null;

    const weekday = format(parsedDate, "EEE", { locale: de }).replace(/\./g, "");
    const day = format(parsedDate, "d", { locale: de });
    const month = format(parsedDate, "MMM", { locale: de }).slice(0, 3);
    const year = format(parsedDate, "yyyy", { locale: de });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(parsedDate);
    targetDate.setHours(0, 0, 0, 0);
    const diffInDays = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    const rest = diffInDays === 0
        ? "heute"
        : diffInDays > 0
            ? `${diffInDays} Tage verbleibend`
            : `${Math.abs(diffInDays)} Tage überfällig`;

    return {
        datum: `${weekday} ${day}. ${month} ${year}`,
        kurz: `${weekday} ${day}. ${month}`,
        rest,
        warnung: diffInDays < 0 ? "text-red-600" : diffInDays <= 4 ? "text-amber-600" : undefined,
    };
}

// Fertig-bis-Datum als Text für die Unterzeile, mit verbleibenden Tagen
export default function AuftragFertigBis({ fertigBis, kurz = false, warnen = true, className }: {
    fertigBis: string | null | undefined;
    kurz?: boolean;
    // false z.B. bei fertigen Aufträgen: das Datum ist dann nicht mehr dringend
    warnen?: boolean;
    className?: string;
}) {
    if (!fertigBis) {
        return <span className={className}>kein Fertig-Datum</span>
    }
    const info = fertigBisInfo(fertigBis);
    if (!info) {
        return <span className={className}>ungültiges Fertig-Datum</span>;
    }

    // Kurz für die Liste: nur das Datum, farbig wenn bald fällig oder überfällig
    if (kurz) {
        return <span className={cn(className, warnen && info.warnung)} title={info.rest}>bis {info.kurz}</span>;
    }

    return (
        <span className={className}>
            fertig bis <span className="font-medium text-foreground">{info.datum}</span>{" "}
            <span className={info.warnung}>({info.rest})</span>
        </span>
    )
};
