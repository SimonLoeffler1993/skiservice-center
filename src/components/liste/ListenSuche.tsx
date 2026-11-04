"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";

// Pause nach dem Tippen, bevor gesucht wird
const WARTEZEIT_MS = 300;

// Suche nach dem Kundennamen (?suche=). Andere Filter bleiben erhalten.
export default function ListenSuche({ suche }: { suche: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [text, setText] = useState(suche);
    // Zuletzt in die URL geschriebener Wert
    const [gesendet, setGesendet] = useState(suche);
    const [isPending, startTransition] = useTransition();

    // Von außen geänderte URL übernehmen, z.B. Menülink (State-Anpassung beim Rendern statt im Effekt)
    if (!isPending && suche !== gesendet) {
        setGesendet(suche);
        setText(suche);
    }

    useEffect(() => {
        const neu = text.trim();
        if (neu === gesendet) return;
        const timer = setTimeout(() => {
            const parameter = new URLSearchParams(searchParams.toString());
            if (neu) parameter.set("suche", neu);
            else parameter.delete("suche");
            const query = parameter.toString();
            setGesendet(neu);
            // replace: nicht jede Eingabe soll einen Eintrag im Browser-Verlauf erzeugen
            startTransition(() => router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false }));
        }, WARTEZEIT_MS);
        return () => clearTimeout(timer);
    }, [text, gesendet, searchParams, pathname, router]);

    return (
        <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                type="search"
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Kunde suchen..."
                aria-label="Nach Kundenname suchen"
                maxLength={100}
                className="h-10 bg-background pl-9 pr-9 [&::-webkit-search-cancel-button]:appearance-none"
            />
            {text && (
                <button
                    type="button"
                    onClick={() => setText("")}
                    aria-label="Suche löschen"
                    className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}
