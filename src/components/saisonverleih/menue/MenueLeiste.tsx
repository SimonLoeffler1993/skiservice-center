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
                                {gruppe.links.map((link) => (
                                    <NavigationMenuLink key={link.href} href={link.href}>{link.titel}</NavigationMenuLink>
                                ))}
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
            </NavigationMenu>
        </>
    );
}
