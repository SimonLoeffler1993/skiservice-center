import { NavigationMenu, NavigationMenuLink, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent } from "@/components/ui/navigation-menu";
import { Home } from "lucide-react";

import { MENUE_GRUPPEN } from "./menueeintraege";
import MobileMenue from "./MobileMenue";

export default function MenueLeiste() {
    return (
        <>
            {/* Handy / kleines Tablet */}
            <MobileMenue />

            {/* Ab md */}
            <NavigationMenu viewport={false} className="hidden md:flex">
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/">
                            <Home size={18} />
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    {MENUE_GRUPPEN.map((gruppe) => (
                        <NavigationMenuItem key={gruppe.titel}>
                            <NavigationMenuTrigger>{gruppe.titel}</NavigationMenuTrigger>
                            <NavigationMenuContent>
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
        </>
    );
}
