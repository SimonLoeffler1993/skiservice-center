import { NavigationMenu, NavigationMenuLink, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent } from "@/components/ui/navigation-menu";

export default function MenueLeiste() {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Saisonverleih</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <NavigationMenuLink href="/saisonverleih/anzeigen">Anzeigen</NavigationMenuLink>
                        <NavigationMenuLink href="/saisonverleih/erstellen">Neu</NavigationMenuLink>
                    </NavigationMenuContent>
                </NavigationMenuItem>   
            </NavigationMenuList>
        </NavigationMenu>
    );
}