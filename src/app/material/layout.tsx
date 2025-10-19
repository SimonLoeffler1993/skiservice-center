import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { MaterialSidebar } from "@/components/material/material-sidebar";
import { getSkiHersteller } from "@/lib/materialactions";
import { SkiHerstellerContextProvider } from "@/context/skihersteller-context";
import { getSkiArt } from "@/lib/materialactions";
import { SkiArtContextProvider } from "@/context/skiart-context";
import { getModell } from "@/lib/materialactions";
import { SkiModellContextProvider } from "@/context/skimodell-context";

type MaterialLayoutProps = {
    children: React.ReactNode;
}

export default function MaterialLayout({ children }: MaterialLayoutProps) {
    const herstellerPromise = getSkiHersteller();
    const artPromise = getSkiArt();
    const modellPromise = getModell();
    return (
        <SidebarProvider>
            <SkiHerstellerContextProvider herstellerPromise={herstellerPromise}>
                <SkiArtContextProvider artPromise={artPromise}>
                    <SkiModellContextProvider modellPromise={modellPromise}>
                        <MaterialSidebar />
                        <main>
                            <SidebarTrigger />
                            {children}
                        </main>
                    </SkiModellContextProvider>
                </SkiArtContextProvider>
            </SkiHerstellerContextProvider>
        </SidebarProvider>
    );
}