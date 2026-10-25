import { type LucideIcon } from "lucide-react";

type ScanLeerProps = {
    icon: LucideIcon;
    titel: string;
    text: string;
};

// Leerzustand vor dem ersten Scan
export default function ScanLeer({ icon: Icon, titel, text }: ScanLeerProps) {
    return (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-muted/30 px-6 py-12 text-center sm:py-16">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-background shadow-sm">
                <Icon className="h-7 w-7 text-muted-foreground" />
            </span>
            <p className="text-lg font-medium">{titel}</p>
            <p className="max-w-sm text-sm text-muted-foreground">{text}</p>
        </div>
    );
}
