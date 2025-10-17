import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { MaterialSidebar } from "@/components/material/material-sidebar";
import { getSkiHersteller } from "@/lib/materialactions";
import { SkiHerstellerContextProvider } from "@/context/skihersteller-context";

type MaterialLayoutProps = {
    children: React.ReactNode;
}

export default function MaterialLayout({ children }: MaterialLayoutProps) {
    const herstellerPromise = getSkiHersteller();
    return (
        <SidebarProvider>
            <SkiHerstellerContextProvider herstellerPromise={herstellerPromise}>
                <MaterialSidebar />
                <main>
                    <SidebarTrigger />
                    {children}
                </main>
            </SkiHerstellerContextProvider>
        </SidebarProvider>
    );
}