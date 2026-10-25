import { CircleAlert, CircleCheck } from "lucide-react";

import { cn } from "@/lib/utils";

export type Meldung = { ok: boolean; text: string };

// Ergebnis der letzten Aktion, z.B. "2 Ski fertig gestellt"
export default function ScanMeldung({ meldung }: { meldung: Meldung | null }) {
    if (!meldung) return null;
    const Icon = meldung.ok ? CircleCheck : CircleAlert;
    return (
        <p
            aria-live="polite"
            className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium",
                meldung.ok ? "border-green-200 bg-green-50 text-green-800" : "border-red-200 bg-red-50 text-red-700",
            )}
        >
            <Icon className="h-4 w-4 shrink-0" />
            {meldung.text}
        </p>
    );
}
