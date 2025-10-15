import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { MaterialSidebar } from "@/components/material/material-sidebar";

type MaterialLayoutProps = {
    children: React.ReactNode;
}

export default function MaterialLayout({ children }: MaterialLayoutProps) {
    return (
        <SidebarProvider>
            <MaterialSidebar />
            <main>
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
    );
}