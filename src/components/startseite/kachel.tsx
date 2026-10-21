import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type KachelProps = {
    titel: string;
    beschreibung: string;
    href: string;
    icon: LucideIcon;
}

// Ganze Kachel ist ein Link, damit auch Mittelklick bzw. "In neuem Tab öffnen" funktioniert
export default function Kachel({ titel, beschreibung, href, icon: Icon }: KachelProps) {
    return (
        <Link
            href={href}
            className="group flex h-full items-start gap-4 rounded-xl border bg-card p-4 shadow-xs transition hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-5 w-5" />
            </span>
            <span className="space-y-1">
                <span className="block font-medium">{titel}</span>
                <span className="block text-sm text-muted-foreground">{beschreibung}</span>
            </span>
        </Link>
    );
}
