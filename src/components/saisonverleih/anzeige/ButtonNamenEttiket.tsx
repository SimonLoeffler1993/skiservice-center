"use client";

import { Button } from "@/components/ui/button";
import { getSaisonVerleihNamenEttiket } from "@/lib/saisonverleihactions";
import { startTransition, useActionState } from "react";
import { Tags } from 'lucide-react';
import { useSaisonverleihanzeigeContext } from "@/context/saisonverleihanzeige-contex";

export default function ButtonNamenEttiket() {
  const { id } = useSaisonverleihanzeigeContext();
  const [state, action, isPending] = useActionState(getSaisonVerleihNamenEttiket, null);

  function handleNamenEttiketPrint() {
    startTransition(() => action(id));
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={handleNamenEttiketPrint} disabled={isPending}>
        <Tags /> Namen Ettiket
      </Button>

      {isPending && (
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Wird gedruckt…
        </p>
      )}

      {!isPending && state?.success && (
        <p className="text-sm text-green-600" aria-live="polite">
          Erfolgreich gestartet.
        </p>
      )}

      {!isPending && state && state.success === false && (
        <p className="text-sm text-red-600" aria-live="assertive">
          {state.message ?? "Fehler beim Drucken des Namens-Ettikets."}
        </p>
      )}
    </div>
  );
}