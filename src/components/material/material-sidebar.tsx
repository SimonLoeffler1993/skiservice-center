"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

export function MaterialSidebar() {
    const searchParams = useSearchParams()
    const view = searchParams.get("view") ?? "ski"

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenuButton>
                        <Link href="../">Startseite</Link>
                    </SidebarMenuButton>
                    <SidebarGroupLabel>Material-Erfassen</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={view === "hersteller"}>
                                    <Link href="/material?view=skihersteller">Hersteller</Link>
                                </SidebarMenuButton>
                                <SidebarMenuButton asChild isActive={view === "modell"}>
                                    <Link href="/material?view=skimodell">Modell</Link>
                                </SidebarMenuButton>
                                <SidebarMenuButton asChild isActive={view === "ski"}>
                                    <Link href="/material?view=skierstellen">Ski</Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                    <SidebarGroupLabel>Schuh-Erfassen</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={view === "hersteller"}>
                                    <Link href="/material?view=schuhhersteller">Hersteller</Link>
                                </SidebarMenuButton>
                                <SidebarMenuButton asChild isActive={view === "modell"}>
                                    <Link href="/material?view=schuhmodell">Modell</Link>
                                </SidebarMenuButton>
                                <SidebarMenuButton asChild isActive={view === "ski"}>
                                    <Link href="/material?view=schuhstelle">Schuh</Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}