"use client";

import { NavigationMenu, NavigationMenuLink, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent } from "@/components/ui/navigation-menu";
import { Home } from "lucide-react";

import BenutzerMenue from "@/components/anmeldung/BenutzerMenue";
import { useBenutzer } from "@/context/benutzer-context";
import { sichtbareGruppen } from "./menueeintraege";
import MobileMenue from "./MobileMenue";

export default function MenueLeiste() {
    const { darfAdmin } = useBenutzer();
    const gruppen = sichtbareGruppen(darfAdmin);
    return (
        <>
            {/* Handy / kleines Tablet */}
            <MobileMenue />

            {/* Ab md */}
            <div className="hidden items-center justify-between md:flex">
            <NavigationMenu viewport={false}>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/">
                            <Home size={18} />
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    {gruppen.map((gruppe) => (
                        <NavigationMenuItem key={gruppe.titel}>
                            <NavigationMenuTrigger>{gruppe.titel}</NavigationMenuTrigger>
                            {/* z-50: sonst liegen Suchfelder und andere positionierte Elemente der Seite über dem Menü */}
                            <NavigationMenuContent className="z-50">
                                <ul className="grid w-48 gap-1">
                                    {gruppe.links.map((link) => (
                                        <li key={link.href}>
                                            <NavigationMenuLink href={link.href} className="flex-row items-center gap-2">
                                                <link.icon />
                                                {link.titel}
                                            </NavigationMenuLink>
                                        </li>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
            </NavigationMenu>
            <BenutzerMenue />
            </div>
        </>
    );
}
