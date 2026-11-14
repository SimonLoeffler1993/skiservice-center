"use client";

import { useRouter } from "next/navigation";

import KundeSuchForm from "@/components/kunde/suche/suchform";

// Suche im Kundenbereich: die Auswahl (auch "Neuer Kunde" und Check-in) führt auf die Kundenseite
export default function KundenSuche() {
    const router = useRouter();
    return <KundeSuchForm nurAuswahl onKundeSelected={(kunde) => router.push(`/kunde/${kunde.ID}`)} />;
}
