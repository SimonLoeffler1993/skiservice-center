"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { Table, TableCell, TableRow } from "@/components/ui/table";

// Rahmen der Listenansicht, breite Tabellen scrollen in sich
export function ListenTabelle({ children }: { children: React.ReactNode }) {
    return (
        <div className="overflow-hidden rounded-lg border bg-card">
            <Table>{children}</Table>
        </div>
    );
}

// Ganze Zeile öffnet den Eintrag (Klick, Enter, Leertaste), Chevron rechts als Hinweis
export function ListenZeile({ href, titel, children }: { href: string; titel: string; children: React.ReactNode }) {
    const router = useRouter();

    return (
        <TableRow
            tabIndex={0}
            aria-label={`${titel} öffnen`}
            className="h-12 cursor-pointer hover:bg-muted focus-visible:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            onClick={() => router.push(href)}
            onKeyDown={(event) => {
                if (event.target !== event.currentTarget) return;
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    router.push(href);
                }
            }}
        >
            {children}
            <TableCell className="w-8 pl-0">
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </TableCell>
        </TableRow>
    );
}

// Nummer als echter Link, damit Mittelklick und "In neuem Tab öffnen" gehen
export function ListenNummer({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <TableCell className="pl-3 font-bold">
            <Link href={href} tabIndex={-1} onClick={(event) => event.stopPropagation()} className="hover:underline">
                {children}
            </Link>
        </TableCell>
    );
}
