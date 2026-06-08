import { NavigationMenu, NavigationMenuLink, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent } from "@/components/ui/navigation-menu";
import { Home } from "lucide-react";

export default function MenueLeiste() {
    return (
        <NavigationMenu viewport={false}>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink href="/">
                        <Home size={18} />
                    </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NavigationMenuTrigger>Saisonverleih</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <NavigationMenuLink href="/saisonverleih/anzeigen">Anzeigen</NavigationMenuLink>
                        <NavigationMenuLink href="/saisonverleih/erstellen">Neu</NavigationMenuLink>
                    </NavigationMenuContent>
                </NavigationMenuItem>   

                <NavigationMenuItem>
                    <NavigationMenuTrigger>Skiservice</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <NavigationMenuLink href="/skiservice/anzeigen">Anzeigen</NavigationMenuLink>
                        <NavigationMenuLink href="/skiservice/erstellen">Neu</NavigationMenuLink>
                    </NavigationMenuContent>
                </NavigationMenuItem>   

                <NavigationMenuItem>
                    <NavigationMenuTrigger>Material</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <NavigationMenuLink href="/material">Übersicht</NavigationMenuLink>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}