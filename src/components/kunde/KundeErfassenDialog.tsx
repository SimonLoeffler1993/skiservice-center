"use client";

import { useEffect, useState, useTransition, type ReactNode } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { orteOptions } from "@/hooks/useOrteOptions";
import { kundeErfassen } from "@/lib/kundeactions";
import { cn } from "@/lib/utils";
import { Kunde, KundeErfassen, kundeErfassenSchema } from "@/types/skikundentypes";

type KundeErfassenDialogProps = {
    // Vorbelegung aus der Suche
    vorname?: string;
    nachname?: string;
    // Neuer Kunde wurde angelegt
    onAngelegt: (kunde: Kunde) => void;
    // Hervorgehoben, wenn die Suche nichts gefunden hat
    hervorheben?: boolean;
    // Eigener Text für den Button, z.B. "Neuer Kunde"
    beschriftung?: string;
    buttonClassName?: string;
};

// Feste Referenz, damit der Effekt unten nicht bei jedem Render neu läuft
const KEINE_ORTE: string[] = [];

function Feld({ id, label, fehler, hinweis, className, children }: { id: string; label: string; fehler?: string; hinweis?: string; className?: string; children: ReactNode }) {
    return (
        <div className={cn("space-y-1.5", className)}>
            <Label htmlFor={id}>{label}</Label>
            {children}
            {hinweis && !fehler && <p className="text-xs text-muted-foreground">{hinweis}</p>}
            {fehler && <p className="text-sm text-destructive">{fehler}</p>}
        </div>
    );
}

// Neuen Kunden direkt im Center anlegen, z.B. wenn die Suche nichts findet
export default function KundeErfassenDialog({ vorname = "", nachname = "", onAngelegt, hervorheben = false, beschriftung, buttonClassName }: KundeErfassenDialogProps) {
    const [offen, setOffen] = useState(false);
    const [fehler, setFehler] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const leer: KundeErfassen = { Vorname: vorname, Nachname: nachname, Strasse: "", Plz: "", Ort: "", Tel: "", Handy: "", Email: "" };
    const { register, handleSubmit, control, setValue, getValues, setError, clearErrors, reset, formState: { errors } } = useForm<KundeErfassen>({
        resolver: zodResolver(kundeErfassenSchema),
        defaultValues: leer,
    });

    // Ort aus der PLZ (TanStack Query + Server Action)
    const plz = (useWatch({ control, name: "Plz" }) ?? "").trim();
    const { data, isFetching: sucheOrt, error: ortFehler, isSuccess } = useQuery({ ...orteOptions(plz), enabled: offen && /^\d{5}$/.test(plz) });
    const orte = data ?? KEINE_ORTE;
    const plzUngueltig = /^\d{5}$/.test(plz) && (!!ortFehler || (isSuccess && orte.length === 0));

    useEffect(() => {
        if (!/^\d{5}$/.test(plz)) {
            setValue("Ort", "");
            return;
        }
        if (ortFehler) {
            setValue("Ort", "");
            setError("Plz", { message: "PLZ konnte nicht geprüft werden" });
            return;
        }
        if (!isSuccess) return;
        if (orte.length === 0) {
            setValue("Ort", "");
            setError("Plz", { message: "PLZ nicht gefunden" });
            return;
        }
        clearErrors("Plz");
        if (!orte.includes(getValues("Ort"))) setValue("Ort", orte[0]);
    }, [plz, orte, ortFehler, isSuccess, setValue, getValues, setError, clearErrors]);

    function speichern(werte: KundeErfassen) {
        // PLZ ist ein Fremdschlüssel: ohne gefundenen Ort nicht speichern
        if (plzUngueltig || (werte.Plz && sucheOrt)) {
            setError("Plz", { message: sucheOrt ? "Ort wird noch gesucht…" : "PLZ nicht gefunden" });
            return;
        }
        startTransition(async () => {
            const antwort = await kundeErfassen(werte);
            if (!antwort.success) {
                setFehler(antwort.error);
                return;
            }
            setOffen(false);
            onAngelegt(antwort.data);
        });
    }

    return (
        <Dialog
            open={offen}
            onOpenChange={(wert) => {
                setOffen(wert);
                if (wert) {
                    reset(leer);
                    setFehler(null);
                }
            }}
        >
            <DialogTrigger asChild>
                <Button type="button" variant={hervorheben ? "default" : "outline"} className={cn("w-full sm:w-auto", buttonClassName)}>
                    <UserPlus className="h-4 w-4" />
                    {beschriftung ?? (hervorheben ? "Neuen Kunden erfassen" : "Kunde nicht dabei? Neuen Kunden erfassen")}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
                {/* Handy: PLZ/Ort und Telefon/Handy nebeneinander, damit der Dialog kurz bleibt */}
                <DialogHeader>
                    <DialogTitle>Neuen Kunden erfassen</DialogTitle>
                    <DialogDescription>Nach dem Anlegen wird der Kunde direkt ausgewählt.</DialogDescription>
                </DialogHeader>

                <form id="kunde-erfassen" onSubmit={handleSubmit(speichern)} className="space-y-6" noValidate>
                    <fieldset className="space-y-3">
                        <legend className="mb-2 font-semibold">Name und Adresse</legend>
                        <div className="grid grid-cols-6 gap-3">
                            <Feld id="ke-vorname" label="Vorname" fehler={errors.Vorname?.message} className="col-span-6 sm:col-span-3">
                                <Input id="ke-vorname" autoComplete="off" autoCapitalize="words" {...register("Vorname")} />
                            </Feld>
                            <Feld id="ke-nachname" label="Nachname" fehler={errors.Nachname?.message} className="col-span-6 sm:col-span-3">
                                <Input id="ke-nachname" autoComplete="off" autoCapitalize="words" {...register("Nachname")} />
                            </Feld>
                            <Feld id="ke-strasse" label="Straße und Hausnummer" fehler={errors.Strasse?.message} className="col-span-6">
                                <Input id="ke-strasse" autoComplete="off" {...register("Strasse")} />
                            </Feld>
                            <Feld id="ke-plz" label="PLZ" fehler={errors.Plz?.message} className="col-span-2">
                                <Input id="ke-plz" inputMode="numeric" pattern="[0-9]*" maxLength={5} autoComplete="off" {...register("Plz")} />
                            </Feld>
                            <Feld id="ke-ort" label="Ort" hinweis={sucheOrt ? "suche Ort…" : "wird aus der PLZ übernommen"} className="col-span-4">
                                {orte.length > 1 ? (
                                    <select id="ke-ort" className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm" {...register("Ort")}>
                                        {orte.map((ort) => <option key={ort} value={ort}>{ort}</option>)}
                                    </select>
                                ) : (
                                    <Input id="ke-ort" className="bg-muted/50" readOnly tabIndex={-1} {...register("Ort")} />
                                )}
                            </Feld>
                        </div>
                    </fieldset>

                    <fieldset className="space-y-3">
                        <legend className="mb-2">
                            <span className="font-semibold">Kontakt</span>
                            <span className="ml-2 text-sm text-muted-foreground">mindestens eine Angabe</span>
                        </legend>
                        {errors.Tel?.message && <p className="text-sm text-destructive">{errors.Tel.message}</p>}
                        <div className="grid grid-cols-6 gap-3">
                            <Feld id="ke-tel" label="Telefon" className="col-span-3">
                                <Input id="ke-tel" type="tel" autoComplete="off" {...register("Tel")} />
                            </Feld>
                            <Feld id="ke-handy" label="Handy" fehler={errors.Handy?.message} className="col-span-3">
                                <Input id="ke-handy" type="tel" autoComplete="off" {...register("Handy")} />
                            </Feld>
                            <Feld id="ke-email" label="E-Mail" fehler={errors.Email?.message} className="col-span-6">
                                <Input id="ke-email" type="email" autoComplete="off" autoCapitalize="none" {...register("Email")} />
                            </Feld>
                        </div>
                    </fieldset>
                </form>

                {fehler && <p className="text-sm text-destructive">{fehler}</p>}

                <DialogFooter className="gap-2">
                    <Button type="button" variant="outline" onClick={() => setOffen(false)} disabled={isPending}>
                        Abbrechen
                    </Button>
                    <Button type="submit" form="kunde-erfassen" disabled={isPending}>
                        {isPending ? "Wird angelegt…" : "Kunde anlegen"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
