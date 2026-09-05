import { skiSchuheOptions } from "@/hooks/useSchuhMaterialOptions"
import { useQuery } from "@tanstack/react-query"
import SkischuhCard from "./schuhcard"

export default function SkischuheListe() {
    const {data, isLoading, error} = useQuery(skiSchuheOptions)

    if (isLoading) return <p>Skischuhe werden geladen...</p>

    if (error) return <p className="text-red-500">Fehler beim Laden der Skischuhe.</p>

    if (!data?.success) return <p>Skischuhe konnten nicht geladen werden</p>

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-semibold">Skischuhe Liste</h1>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {data.data.map((schuh) => (
                    <SkischuhCard key={schuh.ID} schuh={schuh} />
                ))}
            </div>
        </div>
    )
}