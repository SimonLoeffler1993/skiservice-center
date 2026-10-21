"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MENUE_GRUPPEN } from "./menueeintraege";

export default function MobileMenue() {
    const [offen, setOffen] = useState(false);

    return (
        <div className="flex items-center justify-between md:hidden">
            <Link href="/" className="flex items-center gap-2 p-2" aria-label="Startseite">
                <Home size={18} />
                <span className="font-semibold">Skiservice Center</span>
            </Link>
            <Sheet open={offen} onOpenChange={setOffen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Menü öffnen">
                        <Menu />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>Menü</SheetTitle>
                    </SheetHeader>
                    <nav className="flex flex-col gap-4 px-4 pb-4">
                        {MENUE_GRUPPEN.map((gruppe) => (
                            <div key={gruppe.titel} className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-muted-foreground">{gruppe.titel}</span>
                                {gruppe.links.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setOffen(false)}
                                        className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-accent"
                                    >
                                        <link.icon className="h-4 w-4 text-muted-foreground" />
                                        {link.titel}
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
    );
}
