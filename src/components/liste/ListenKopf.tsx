import Link from "next/link";
import { Plus, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type ListenKopfProps = {
    titel: string;
    icon: LucideIcon;
    // z.B. "12 Aufträge"
    unterzeile?: string;
    neuHref: string;
    neuText: string;
    // Filter (Saison, Art)
    children?: React.ReactNode;
};

// Kopf der Listen: Titel mit Anzahl, Button "Neu" und Filterzeile
export default function ListenKopf({ titel, icon: Icon, unterzeile, neuHref, neuText, children }: ListenKopfProps) {
    return (
        <header className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                    </span>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{titel}</h1>
                        {unterzeile && <p className="text-sm text-muted-foreground">{unterzeile}</p>}
                    </div>
                </div>
                <Button asChild className="h-10">
                    <Link href={neuHref}>
                        <Plus className="h-4 w-4" />
                        {neuText}
                    </Link>
                </Button>
            </div>
            {children && <div className="flex flex-wrap items-center gap-3">{children}</div>}
        </header>
    );
}
