import Link from "next/link";
import { ChevronRight, Loader2, Plus, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Raster der Listen: Handy 1, Tablet 2, ab xl 3 Spalten
export const LISTEN_RASTER = "grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-3";

// Ganze Karte antippbar, Chevron rechts als Hinweis
export function ListenKarte({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
    return (
        <Link
            href={href}
            className={cn(
                "group flex items-stretch gap-2 rounded-xl border bg-card p-4 transition-colors hover:border-foreground/20 hover:bg-muted/40 active:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                className,
            )}
        >
            <div className="min-w-0 flex-1 space-y-2">{children}</div>
            <ChevronRight className="h-5 w-5 shrink-0 self-center text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </Link>
    );
}

// Ende der Liste: Sentinel fürs Nachladen und dezenter Status
export function ListenFuss({ sentinel, laedt, alleGeladen, anzahl, einheit }: {
    sentinel: (element: Element | null) => void;
    laedt: boolean;
    alleGeladen: boolean;
    anzahl: number;
    einheit: string;
}) {
    return (
        <div ref={sentinel} className="flex min-h-12 items-center justify-center text-sm text-muted-foreground">
            {laedt ? (
                <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Weitere werden geladen...</span>
            ) : alleGeladen && anzahl > 0 ? (
                <span>Alle {anzahl} {einheit} geladen</span>
            ) : null}
        </div>
    );
}

// Leerzustand mit Button zum Anlegen
export function ListenLeer({ icon: Icon, titel, neuHref, neuText }: { icon: LucideIcon; titel: string; neuHref: string; neuText: string }) {
    return (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-muted/30 px-6 py-14 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-background shadow-sm">
                <Icon className="h-7 w-7 text-muted-foreground" />
            </span>
            <p className="text-lg font-medium">{titel}</p>
            <Button asChild variant="outline" className="h-10">
                <Link href={neuHref}>
                    <Plus className="h-4 w-4" />
                    {neuText}
                </Link>
            </Button>
        </div>
    );
}

// Platzhalter beim ersten Laden
export function ListenSkeleton() {
    return (
        <div className={LISTEN_RASTER}>
            {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="space-y-3 rounded-xl border p-4">
                    <div className="flex justify-between">
                        <Skeleton className="h-6 w-28" />
                        <Skeleton className="h-6 w-24" />
                    </div>
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-52" />
                    <div className="flex justify-between">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-6 w-16" />
                    </div>
                </div>
            ))}
        </div>
    );
}
