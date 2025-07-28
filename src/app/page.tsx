"use client";

import Kachel from "@/components/startseite/kachel";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const handleSaisonverleihErstellen = () => {
    router.push('/saisonverleih/erstellen');
  };
  const handleServiceErstellen = () => {
    // Logik für Service erstellen
  };

  return (
    <div className="min-h-screen flex flex-col gap-2 items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold underline">Skiservice Center</h1>
      <h2 className="text-2xl">was soll gemacht werden?</h2>
      <Kachel title="Saisonverleih" description="Es wird ein Saisonverleih erfasst.">
        <Button onClick={handleSaisonverleihErstellen}>Erstellen</Button>
      </Kachel>
      <Kachel title="Service" description="Es wird ein Saisonverleih erfasst.">
        <Button>Erstellen</Button>
      </Kachel>
    </div>
  );
}
