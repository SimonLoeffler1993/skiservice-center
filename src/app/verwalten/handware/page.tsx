import { ShoppingBag } from "lucide-react";

import HandwareListe from "@/components/handware/HandwareListe";

export default function HandwareSeite() {
    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                <h1 className="text-xl font-semibold">Handware</h1>
            </div>
            <HandwareListe />
        </section>
    );
}
