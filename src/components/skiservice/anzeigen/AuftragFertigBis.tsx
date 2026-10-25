import { format } from "date-fns";
import { de } from "date-fns/locale";

// Fertig-bis-Datum als Text für die Unterzeile, mit verbleibenden Tagen
export default function AuftragFertigBis({ fertigBis }: { fertigBis: string | null | undefined }) {
    if (!fertigBis) {
        return <span>kein Fertig-Datum</span>
    }

    const normalizedDate = fertigBis.trim();
    const parsedDate = normalizedDate.includes('.')
        ? new Date(normalizedDate.split('.').reverse().join('-'))
        : new Date(normalizedDate);

    const isValidDate = !Number.isNaN(parsedDate.getTime());

    if (!isValidDate) {
        return <span>ungültiges Fertig-Datum</span>;
    }

    const weekday = format(parsedDate, "EEE", { locale: de }).replace(/\./g, "");
    const day = format(parsedDate, "d", { locale: de });
    const month = format(parsedDate, "MMM", { locale: de }).slice(0, 3);
    const year = format(parsedDate, "yyyy", { locale: de });
    const formattedDate = `${weekday} ${day}. ${month} ${year}`;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDate = new Date(parsedDate);
    targetDate.setHours(0, 0, 0, 0);

    const diffInDays = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    const remainingText = diffInDays === 0
        ? "heute"
        : diffInDays > 0
            ? `${diffInDays} Tage verbleibend`
            : `${Math.abs(diffInDays)} Tage überfällig`;

    const needsAttention = diffInDays <= 4;
    const warningClass = diffInDays < 0 ? "text-red-600" : "text-amber-600";

    return (
        <span>
            fertig bis <span className="font-medium text-foreground">{formattedDate}</span>{" "}
            <span className={needsAttention ? warningClass : undefined}>({remainingText})</span>
        </span>
    )
};