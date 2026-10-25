import { Check } from "lucide-react";

import { cn, euro } from "@/lib/utils";
import { Ski } from "@/types/skiservicetypes";
import SkiBindung from "../SkiBindung";
import SkiStatus from "../SkiStatus";

type SkiAuswahlZeileProps = {
    ski: Ski;
    ausgewaehlt: boolean;
    onUmschalten: () => void;
};

// Antippbare Zeile in der Fertigstellen-Ansicht: Auswahl mit Häkchen, Service, Status und Preis
export default function SkiAuswahlZeile({ ski, ausgewaehlt, onUmschalten }: SkiAuswahlZeileProps) {
    const preis = ski.preis + (ski.bindung_check ? ski.bindung_preis : 0);

    return (
        <button
            type="button"
            onClick={onUmschalten}
            aria-pressed={ausgewaehlt}
            className={cn(
                "flex min-h-14 w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
                ausgewaehlt ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:bg-muted/50",
            )}
        >
            <span
                className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2",
                    ausgewaehlt ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40",
                )}
            >
                {ausgewaehlt && <Check className="h-4 w-4" />}
            </span>
            <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{ski.name || `Ski #${ski.id}`}</span>
                <span className="block truncate text-sm text-muted-foreground">{ski.service}</span>
            </span>
            <span className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-2">
                <SkiStatus status={ski.status} />
                <SkiBindung BindungCheck={ski.bindung_check} BindungStatus={ski.bindung_status} />
            </span>
            <span className="hidden w-20 shrink-0 text-right text-sm font-medium tabular-nums sm:block">{euro.format(preis)}</span>
        </button>
    );
}
