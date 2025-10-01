import { SaisonverleihanzeigeContextProvider } from "@/context/saisonverleihanzeige-contex";
import { getSaisonVerleihById } from "@/lib/saisonverleihactions";

export default async function SaisonverleihAnzeigenLayout({ children, params }: { children: React.ReactNode, params: Promise<{ id: string }> }) {
    const { id } = await params;
    const saisonverleihanzeige = getSaisonVerleihById(id);
    return (
            <SaisonverleihanzeigeContextProvider saisonverleihanzeigePromise={saisonverleihanzeige}>
                {children}
            </SaisonverleihanzeigeContextProvider>
    );
}