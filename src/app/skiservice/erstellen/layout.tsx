// Nicht statisch vorrendern, sonst wird die Preisliste beim Build eingefroren
export const dynamic = "force-dynamic";

import MenueLeiste from "@/components/saisonverleih/menue/MenueLeiste";

export default function SkiserviceErstellenLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="container mx-auto p-4 space-y-6">
            <MenueLeiste />
            {children}
        </div>
    );
}