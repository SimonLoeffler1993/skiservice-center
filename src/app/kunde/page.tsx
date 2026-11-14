import KundenSuche from "@/components/kunde/KundenSuche";

export default function KundenSeite() {
    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Kunden</h1>
                <p className="text-muted-foreground">Kunde suchen, um ihn zu bearbeiten und seine Aufträge, Verleihe und Quittungen zu sehen.</p>
            </div>
            <KundenSuche />
        </div>
    );
}
