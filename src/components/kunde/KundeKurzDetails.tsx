import { Kunde } from "../../types/skikundentypes";

type KundeKurzDetailsProps = {
    kunde: Kunde | undefined | null
};

function KundenInitialen(name: string) {
    const nameParts = name.trim().split(" ").filter(Boolean);

    if (nameParts.length >= 2) {
        return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    } else if (nameParts.length === 1 && nameParts[0].length >= 2) {
        return nameParts[0].slice(0, 2).toUpperCase();
    } else {
        return (nameParts[0] || '').toUpperCase();
    }
}

export default function KundeKurzDetails({ kunde }: KundeKurzDetailsProps) {
    if (!kunde) {
        return (
            <div className="flex flex-col items-center gap-3 py-10">
                <p className="text-sm text-muted-foreground">Keine Kundendaten verfügbar.</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-border bg-card p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-4">
                    Kunde
                </p>
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {KundenInitialen(kunde.Vorname + " " + kunde.Nachname)}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-foreground">{kunde.Vorname} {kunde.Nachname}</p>
                        <p className="text-xs text-muted-foreground">Kunde-ID: {kunde.ID}</p>
                    </div>
                </div>
                <div className="border-t border-border pt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Telefon</span>
                        <span className="text-foreground">{kunde.Tel}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">E-Mail</span>
                        <span className="text-blue-600 dark:text-blue-400">{kunde.Email}</span>
                    </div>
                </div>
            </div>
    );
}