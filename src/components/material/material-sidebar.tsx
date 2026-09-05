"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Mountain, Footprints, GripVertical, Home } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from "@/components/ui/sidebar"

const SKI_ITEMS = [
    { label: "Hersteller", view: "skihersteller" },
    { label: "Modell", view: "skimodell" },
    { label: "Ski", view: "skierstellen" },
]

const SCHUH_ITEMS = [
    { label: "Hersteller", view: "schuhhersteller" },
    { label: "Modell", view: "schuhmodell" },
    { label: "Schuh", view: "schuherstellen" },
]

const STOCK_ITEMS = [{ label: "Stöcke", view: "stoecke" }]

export function MaterialSidebar() {
    const searchParams = useSearchParams()
    const view = searchParams.get("view") ?? "ski"

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenuButton asChild>
                        <Link href="../">
                            <Home />
                            Startseite
                        </Link>
                    </SidebarMenuButton>
                </SidebarGroup>

                <SidebarSeparator />

                <MaterialGroup icon={Mountain} label="Ski" items={SKI_ITEMS} activeView={view} />
                <MaterialGroup icon={Footprints} label="Schuhe" items={SCHUH_ITEMS} activeView={view} />
                <MaterialGroup icon={GripVertical} label="Ski Stöcke" items={STOCK_ITEMS} activeView={view} />
            </SidebarContent>
        </Sidebar>
    )
}

function MaterialGroup({
    icon: Icon,
    label,
    items,
    activeView,
}: {
    icon: React.ComponentType<{ className?: string }>
    label: string
    items: { label: string; view: string }[]
    activeView: string
}) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2 text-sidebar-foreground/90 font-semibold">
                <Icon className="size-4" />
                {label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.view}>
                            <SidebarMenuButton asChild isActive={activeView === item.view}>
                                <Link href={`/material?view=${item.view}`}>{item.label}</Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}