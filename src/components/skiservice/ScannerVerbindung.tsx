import { Badge } from "../ui/badge";

type ScannerVerbindungProps = {
    verbunden: boolean;
}

export default function ScannerVerbindung({ verbunden }: ScannerVerbindungProps) {
    if (verbunden) {
        return (
            <Badge className="gap-2 rounded-full px-3 py-1 border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400">
                <span className="relative flex h-2 w-2 shrink-0">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500 dark:bg-green-400" />
                </span>
                Warte auf Scan...
            </Badge>
        )
    }

    return (
        <Badge className="gap-2 rounded-full px-3 py-1 border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
            <span className="h-2 w-2 rounded-full bg-red-500 dark:bg-red-400 animate-pulse" />
            Keine Verbindung
        </Badge>
    )
}