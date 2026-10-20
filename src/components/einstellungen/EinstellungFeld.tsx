"use client";

import { Control, Controller, UseFormRegister, UseFormSetValue } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Einstellung, EinstellungenWerte } from "@/types/einstellungentypes";

// Passender Port beim Wechsel der Verschlüsselung
const STANDARD_PORTS: Record<string, number> = { ssl: 465, starttls: 587, keine: 25 };

const AUSWAHL_TEXTE: Record<string, string> = {
    ssl: "SSL / TLS",
    starttls: "STARTTLS",
    keine: "Keine (interner Relay)",
};

type EinstellungFeldProps = {
    einstellung: Einstellung;
    control: Control<EinstellungenWerte>;
    register: UseFormRegister<EinstellungenWerte>;
    setValue: UseFormSetValue<EinstellungenWerte>;
    onGeheimnisLoeschen: (schluessel: string) => void;
}

export default function EinstellungFeld({ einstellung, control, register, setValue, onGeheimnisLoeschen }: EinstellungFeldProps) {
    const id = `einstellung-${einstellung.schluessel}`;

    if (einstellung.typ === "bool") {
        return (
            <Field orientation="horizontal">
                <Controller
                    control={control}
                    name={einstellung.schluessel}
                    render={({ field }) => (
                        <Checkbox
                            id={id}
                            checked={field.value === true}
                            onCheckedChange={(wert) => field.onChange(wert === true)}
                        />
                    )}
                />
                <FieldContent>
                    <FieldLabel htmlFor={id}>{einstellung.bezeichnung}</FieldLabel>
                    {einstellung.beschreibung && <FieldDescription>{einstellung.beschreibung}</FieldDescription>}
                </FieldContent>
            </Field>
        );
    }

    return (
        <Field>
            <FieldLabel htmlFor={id}>{einstellung.bezeichnung}</FieldLabel>

            {einstellung.typ === "auswahl" ? (
                <Controller
                    control={control}
                    name={einstellung.schluessel}
                    render={({ field }) => (
                        <Select
                            value={field.value?.toString() ?? ""}
                            onValueChange={(wert) => {
                                field.onChange(wert);
                                if (einstellung.schluessel === "SMTP_MODUS") {
                                    setValue("SMTP_PORT", STANDARD_PORTS[wert], { shouldDirty: true });
                                }
                            }}
                        >
                            <SelectTrigger id={id} className="w-full">
                                <SelectValue placeholder="Bitte wählen" />
                            </SelectTrigger>
                            <SelectContent>
                                {einstellung.optionen.map((option) => (
                                    <SelectItem key={option} value={option}>
                                        {AUSWAHL_TEXTE[option] ?? option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            ) : einstellung.typ === "passwort" ? (
                <div className="flex gap-2">
                    <Input
                        id={id}
                        type="password"
                        autoComplete="new-password"
                        placeholder={einstellung.gesetzt ? "•••••••• (gespeichert, leer lassen = unverändert)" : "nicht gesetzt"}
                        {...register(einstellung.schluessel)}
                    />
                    {einstellung.gesetzt && (
                        <Button type="button" variant="outline" onClick={() => onGeheimnisLoeschen(einstellung.schluessel)}>
                            Löschen
                        </Button>
                    )}
                </div>
            ) : (
                <Input
                    id={id}
                    type={einstellung.typ === "zahl" ? "number" : "text"}
                    {...register(einstellung.schluessel)}
                />
            )}

            {einstellung.beschreibung && <FieldDescription>{einstellung.beschreibung}</FieldDescription>}
        </Field>
    );
}
