import { format, parseISO } from "date-fns";

import type { WerkstattVerleih } from "@/types/werkstatttypes";
import WerkstattZeile, { WerkstattErledigt, WerkstattListe } from "./WerkstattZeile";

// Verleihe in Vorbereitung: je Verleih eine Zeile mit Nummer, Name und Bindungsfortschritt
export default function VerleihVorbereitung({ verleihe }: { verleihe: WerkstattVerleih[] }) {
    return (
        <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Verleih: noch vorzubereiten ({verleihe.length})
            </h2>

            {verleihe.length === 0 ? (
                <WerkstattErledigt text="Kein Verleih in Vorbereitung." />
            ) : (
                <WerkstattListe>
                    {verleihe.map((verleih) => (
                        <WerkstattZeile
                            key={verleih.ID}
                            href={`/saisonverleih/anzeigen/${verleih.ID}`}
                            nummer={verleih.Name}
                            name={verleih.kunde_name}
                            zusatz={
                                <>
                                    {verleih.Art === "tag" && <span className="mr-3">Tagesverleih</span>}
                                    {verleih.Start_Am && `ab ${format(parseISO(verleih.Start_Am), "dd.MM.")}`}
                                </>
                            }
                            anzahl={`Bindung ${verleih.material_geprueft}/${verleih.material_gesamt}`}
                        />
                    ))}
                </WerkstattListe>
            )}
        </section>
    );
}
