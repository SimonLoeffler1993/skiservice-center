"use client"
import { type Ski } from "@/types/materialtypes"
import SkiListCard from "./skilistcard"




export default function SkiListe({ skis }: { skis: Ski[] }) {
    const data = skis

    if (data.length === 0) {
        return <p>Keine Skis gefunden</p>
    }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Ski Liste</h1>
        <div className="flex w-full gap-2 sm:w-auto">
          <input
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:shadow-[0_0_0_2px_hsl(var(--ring))]"
            placeholder="Suchen..."
          />
          <select className="rounded-md border bg-background px-3 py-2 text-sm">
            <option>Sortierung</option>
            <option value="modell">Modell</option>
            <option value="hersteller">Hersteller</option>
            <option value="laenge">Länge</option>
            <option value="preis">Preis</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((s) => (
          <SkiListCard key={s.ID} ski={s} />
        ))}
      </div>
    </div>
  )
}