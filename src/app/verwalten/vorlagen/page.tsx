import { Mail } from "lucide-react";

import VorlagenSeite from "@/components/vorlagen/VorlagenSeite";

export default function VorlagenPage() {
    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <h1 className="text-xl font-semibold">Vorlagen</h1>
            </div>
            <VorlagenSeite />
        </section>
    );
}
