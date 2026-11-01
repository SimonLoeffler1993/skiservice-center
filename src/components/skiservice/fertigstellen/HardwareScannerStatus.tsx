import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScannerGeraet } from "@/types/skiscanner";

const MODI: Record<number, string> = {
    0: "Bearbeitung",
    1: "Fertigstellen",
    2: "Bindung prüfen",
};

const FARBEN = {
    gruen: "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400",
    orange: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400",
    rot: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400",
    grau: "border-border bg-muted text-muted-foreground",
};

const PUNKTE = {
    gruen: "bg-green-500 dark:bg-green-400",
    orange: "bg-amber-500 dark:bg-amber-400",
    rot: "bg-red-500 dark:bg-red-400",
    grau: "bg-muted-foreground/50",
};

function StatusBadge({ farbe, text, title }: { farbe: keyof typeof FARBEN; text: string; title?: string }) {
    return (
        <Badge title={title} className={cn("gap-2 rounded-full px-3 py-1", FARBEN[farbe])}>
            <span className={cn("h-2 w-2 shrink-0 rounded-full", PUNKTE[farbe])} />
            {text}
        </Badge>
    );
}

function vorWann(zuletzt: string): string {
    const minuten = Math.floor((Date.now() - new Date(zuletzt).getTime()) / 60_000);
    if (minuten < 1) return "gerade eben";
    if (minuten < 60) return `vor ${minuten} Min.`;
    return `vor ${Math.floor(minuten / 60)} Std.`;
}

function GeraetBadge({ geraet }: { geraet: ScannerGeraet }) {
    const details = [geraet.ip && `IP ${geraet.ip}`, geraet.firmware && `Firmware ${geraet.firmware}`].filter(Boolean).join(", ");
    if (!geraet.verbunden) {
        return <StatusBadge farbe="grau" text={`${geraet.name}: getrennt, zuletzt ${vorWann(geraet.zuletzt)}`} title={details} />;
    }
    if (!geraet.usb_scanner) {
        return <StatusBadge farbe="orange" text={`${geraet.name}: USB-Scanner fehlt`} title={details} />;
    }
    return <StatusBadge farbe="gruen" text={`${geraet.name} · ${MODI[geraet.modus] ?? `Modus ${geraet.modus}`}`} title={details} />;
}

type HardwareScannerStatusProps = {
    geraete: ScannerGeraet[] | undefined;
    // Scanner dieses Tablets, null = alle
    wahl: string | null;
    fehler: boolean;
};

// Verbindungsstatus der Hardware-Scanner (melden sich alle 30 s beim Backend)
export default function HardwareScannerStatus({ geraete, wahl, fehler }: HardwareScannerStatusProps) {
    if (fehler) return <StatusBadge farbe="rot" text="Scanner-Status nicht abrufbar" />;
    if (!geraete) return null;

    if (wahl) {
        const geraet = geraete.find((g) => g.name === wahl);
        return geraet
            ? <GeraetBadge geraet={geraet} />
            : <StatusBadge farbe="rot" text={`${wahl}: nicht verbunden`} />;
    }

    return (
        <>
            {!geraete.some((geraet) => geraet.verbunden) && <StatusBadge farbe="rot" text="Kein Hardware-Scanner verbunden" />}
            {geraete.map((geraet) => <GeraetBadge key={geraet.name} geraet={geraet} />)}
        </>
    );
}
