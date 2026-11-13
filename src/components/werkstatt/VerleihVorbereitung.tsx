import { BadgeCheck, CheckCircle2 } from "lucide-react";
import { format, parseISO } from "date-fns";

import { LISTEN_RASTER, ListenKarte } from "@/components/liste/ListenTeile";
import VerleihArtBadge from "@/components/saisonverleih/liste/VerleihArtBadge";
import type { WerkstattVerleih } from "@/types/werkstatttypes";

// Verleihe in Vorbereitung: hier müssen noch Bindungen geprüft werden
export default function VerleihVorbereitung({ verleihe }: { verleihe: WerkstattVerleih[] }) {
    return (
        <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Verleih: noch vorzubereiten ({verleihe.length})
            </h2>

            {verleihe.length === 0 ? (
                <div className="flex items-center gap-3 rounded-xl border border-dashed bg-muted/30 px-4 py-6 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                    <p>Kein Verleih in Vorbereitung.</p>
                </div>
            ) : (
                <div className={LISTEN_RASTER}>
                    {verleihe.map((verleih) => (
                        <ListenKarte key={verleih.ID} href={`/saisonverleih/anzeigen/${verleih.ID}`}>
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-lg font-bold tracking-tight">{verleih.Name}</p>
                                {verleih.Start_Am && (
                                    <span className="shrink-0 text-sm text-muted-foreground">ab {format(parseISO(verleih.Start_Am), "dd.MM.yyyy")}</span>
                                )}
                            </div>
                            <p className="truncate font-semibold">{verleih.kunde_name}</p>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-sm text-muted-foreground">
                                <VerleihArtBadge art={verleih.Art} startAm={verleih.Start_Am} endeAm={verleih.Ende_Am} />
                                <span className="inline-flex items-center gap-1.5">
                                    <BadgeCheck className="h-4 w-4" />
                                    Bindung {verleih.material_geprueft}/{verleih.material_gesamt}
                                </span>
                            </div>
                        </ListenKarte>
                    ))}
                </div>
            )}
        </section>
    );
}
