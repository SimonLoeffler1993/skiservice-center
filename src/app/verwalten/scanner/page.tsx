import { ScanLine } from "lucide-react";

import ScannerVerwaltung from "@/components/scanner/ScannerVerwaltung";

export default function ScannerSeite() {
    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2">
                <ScanLine className="h-5 w-5 text-muted-foreground" />
                <h1 className="text-xl font-semibold">Hardware-Scanner</h1>
            </div>
            <ScannerVerwaltung />
        </section>
    );
}
