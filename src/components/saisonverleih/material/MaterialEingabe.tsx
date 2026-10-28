"use client";

import { Suspense, useRef, useState } from 'react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import SaisonMaterialPreise from './SaisonMaterialPreise';
import SaisonMaterialSki from './SaisonMaterialSki';
import SaisonMaterialSchuh from './SaisonMaterialSchuh';
import SaisonMaterialStock from './SaisonMaterialStock';
import { Material, MaterialEingabeWerte, MaterialRead, MaterialSchema } from '@/types/materialtypes';
import { BindungsdatenEingabe, LEERE_BINDUNGSDATEN, zuBindungsdaten, zuEingabe } from '@/types/bindungsdatentypes';
import { Checkbox } from '@/components/ui/checkbox';
import BindungsdatenFelder from '@/components/skiservice/bindung/BindungsdatenFelder';
import SaisonMaterialListe from './SaisonMaterialListe';
import { useSaisonverleihContext } from '@/context/saisonverleih-context';

// TODO: Teilweise auf Register umstellen


type MaterialEingabeProps = {
    // Statt in die Liste des neuen Verleihs direkt speichern (bestehender Verleih).
    // Gibt eine Fehlermeldung zurück oder null bei Erfolg.
    onSpeichern?: (material: Material) => Promise<string | null>;
    // Kunde für "Letzte Daten abfragen", ohne Angabe der Kunde des neuen Verleihs
    kundeId?: number;
    // Bearbeiten: vorhandenes Material, mit dessen Werten das Formular vorbelegt wird
    vorgabe?: MaterialRead;
    // Verleih ist bezahlt, der Preis kann nicht mehr geändert werden
    preisGesperrt?: boolean;
};

// Werte zum Bearbeiten, ohne Ski/Schuh/Stock sind die Felder leer
function vorgabeWerte(vorgabe: MaterialRead): MaterialEingabeWerte {
    return {
        Preis: vorgabe.Preis,
        skinr: vorgabe.skinr ?? '',
        // -1 = kein Stock
        stockbez_ID: vorgabe.stockbez_ID ?? -1,
        stocklaenge: vorgabe.stocklaenge ?? 0,
        schuhnr: vorgabe.schuhnr ?? undefined,
        schuhAnzeige: vorgabe.Schuh?.SchuhNr ?? '',
        SkiFahrerName: vorgabe.SkiFahrerName ?? '',
        bindungAktiv: !!vorgabe.bindungsdaten,
        bindungsEingabe: vorgabe.bindungsdaten ? zuEingabe(vorgabe.bindungsdaten) : undefined,
    };
}

export default function MaterialEingabe({ onSpeichern, kundeId, vorgabe, preisGesperrt = false }: MaterialEingabeProps = {}) {
    const [skiValid, setSkiValid] = useState<boolean | null>(null);
    const [schuhValid, setSchuhValid] = useState<boolean | null>(null);
    // Bereits verliehene Teile, die bewusst übernommen werden
    const [skiTrotzdem, setSkiTrotzdem] = useState(false);
    const [schuhTrotzdem, setSchuhTrotzdem] = useState(false);
    // Neuer Key setzt die interne Auswahl der Preis-Komponente zurück
    const [eingabeNr, setEingabeNr] = useState(0);
    const [speicherFehler, setSpeicherFehler] = useState<string | null>(null);
    const { materialList, setMaterialList, kunde } = useSaisonverleihContext();
    // Für die Vorbelegung der Bindungsdaten: zuletzt übernommener Fahrername und Sohle des geprüften Schuhs
    const letzterName = useRef(vorgabe?.SkiFahrerName?.trim() ?? '');
    const schuhSohle = useRef<number | null>(vorgabe?.Schuh?.Sohle ?? null);

    const methods = useForm<MaterialEingabeWerte>({
        resolver: zodResolver(MaterialSchema),
        mode: 'onChange',
        defaultValues: vorgabe ? vorgabeWerte(vorgabe) : {
            Preis: 0,
            skinr: '',
            stockbez_ID: 0,
            stocklaenge: 0,
            schuhnr: undefined,
            schuhAnzeige: '',
            SkiFahrerName: '',
            bindungAktiv: false,
            bindungsEingabe: undefined,
        }
    });

    const { register, handleSubmit, reset, setValue, getValues, watch, formState: { errors, isValid: isFormValid } } = methods;

    const bindungAktiv = watch('bindungAktiv');

    function setBindung(eingabe: BindungsdatenEingabe) {
        setValue('bindungsEingabe', eingabe);
    }

    function bindungUmschalten(aktiv: boolean) {
        setValue('bindungAktiv', aktiv);
        if (!aktiv) {
            setValue('bindungsEingabe', undefined);
            return;
        }
        // Fahrer vom Skifahrernamen, Sohle vom geprüften Leihschuh übernehmen
        const name = getValues('SkiFahrerName').trim();
        letzterName.current = name;
        setBindung({
            ...LEERE_BINDUNGSDATEN,
            Fahrer: name,
            Sohle: schuhSohle.current !== null ? String(schuhSohle.current) : '',
        });
    }

    // Fahrer nachziehen, solange er nicht von Hand geändert wurde
    function fahrerNameGeaendert(name: string) {
        const eingabe = getValues('bindungsEingabe');
        const neu = name.trim();
        if (getValues('bindungAktiv') && eingabe && (eingabe.Fahrer === '' || eingabe.Fahrer === letzterName.current)) {
            setBindung({ ...eingabe, Fahrer: neu, bestaetigt: false });
        }
        letzterName.current = neu;
    }

    function schuhGefunden(schuhId: number | undefined, sohle: number | null) {
        setValue('schuhnr', schuhId, { shouldValidate: true });
        schuhSohle.current = sohle;
        const eingabe = getValues('bindungsEingabe');
        if (sohle !== null && getValues('bindungAktiv') && eingabe && eingabe.Sohle.trim() === '') {
            setBindung({ ...eingabe, Sohle: String(sohle), bestaetigt: false });
        }
    }

    const onSubmit: SubmitHandler<MaterialEingabeWerte> = async (data) => {
        if (skiValid === false || schuhValid === false) {
            alert('Bitte überprüfen Sie die Ski- und Schuh-Nummern. Bereits verliehenes Material mit "Trotzdem übernehmen" bestätigen.');
            return;
        }
        // Eingegebene Schuh-Nr. muss geprüft sein, gespeichert wird die interne ID
        if (data.schuhAnzeige?.trim() && data.schuhnr === undefined) {
            alert('Bitte die Schuh-Nummer mit der Lupe prüfen');
            return;
        }

        const { bindungAktiv: mitBindung, bindungsEingabe, ...werte } = data;
        const bindung = mitBindung ? zuBindungsdaten(bindungsEingabe) : { daten: null, fehler: null };
        if (bindung.fehler) {
            setSpeicherFehler(bindung.fehler);
            return;
        }
        const material: Material = {
            ...werte,
            bindungsdaten: bindung.daten,
            vorlage_id: bindung.daten ? bindungsEingabe?.vorlage_id ?? null : null,
            trotz_belegung: skiTrotzdem || schuhTrotzdem,
        };

        if (onSpeichern) {
            const fehler = await onSpeichern(material);
            setSpeicherFehler(fehler);
            // Beim Bearbeiten schließt der Dialog, kein Zurücksetzen
            if (fehler || vorgabe) return;
        } else {
            setSpeicherFehler(null);
            setMaterialList([...materialList, material]);
        }
        reset();
        letzterName.current = '';
        schuhSohle.current = null;
        setEingabeNr((nr) => nr + 1);
        setSkiValid(null);
        setSchuhValid(null);
    };

    return (
        <FormProvider {...methods}>
            <div className="p-4 sm:p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-md">
                {!vorgabe && <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">Material Eingabe</h1>}

                <form onSubmit={handleSubmit(onSubmit)} className="mb-6 sm:mb-8">
                    {/* Mobil: 1 Spalte | ab sm: 2er-Reihen */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5 mb-4 items-start">
                        {/* Reihe 1: Preis | Skifahrer Name */}
                        <div className="min-w-0">
                            <Suspense fallback={<div>Lade Service-Optionen...</div>}>
                                <SaisonMaterialPreise
                                    key={eingabeNr}
                                    name="Preis"
                                    error={errors.Preis?.message}
                                    startAuswahl={vorgabe ? 'custom' : undefined}
                                    gesperrt={preisGesperrt}
                                />
                            </Suspense>
                        </div>

                        <div className="min-w-0">
                            <label htmlFor="skifahrerName" className="block text-sm font-medium text-gray-700 mb-1">
                                Skifahrer Name
                            </label>
                            <input
                                type="text"
                                id="skifahrerName"
                                {...register('SkiFahrerName', { onChange: (e) => fahrerNameGeaendert(e.target.value) })}
                                className={`w-full px-3 py-2 border ${
                                    errors.SkiFahrerName ? 'border-red-500' : 'border-gray-300'
                                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                placeholder="Name eingeben"
                            />
                            {errors.SkiFahrerName && (
                                <p className="mt-1 text-sm text-red-600">{errors.SkiFahrerName.message}</p>
                            )}
                        </div>

                        {/* Reihe 2: Ski-Nr. | Schuh-Nr. */}
                        <div className="min-w-0">
                            <SaisonMaterialSki
                                value={watch('skinr')}
                                onChange={(value) => setValue('skinr', value)}
                                onCheck={setSkiValid}
                                onTrotzdem={setSkiTrotzdem}
                                vorgabe={vorgabe?.Ski}
                                error={errors.skinr?.message}
                            />
                        </div>

                        <div className="min-w-0">
                            <SaisonMaterialSchuh
                                value={watch('schuhAnzeige') ?? ''}
                                onChange={(value) => setValue('schuhAnzeige', value)}
                                onGefunden={(schuhId, schuh) => schuhGefunden(schuhId, schuh?.Sohle ?? null)}
                                onCheck={setSchuhValid}
                                onTrotzdem={setSchuhTrotzdem}
                                vorgabe={vorgabe?.Schuh}
                                error={errors.schuhnr?.message}
                            />
                        </div>

                        {/* Reihe 3: Stock | Stocklänge */}
                        <div className="min-w-0">
                            <SaisonMaterialStock
                                value={watch('stockbez_ID')}
                                onChange={(value) => setValue('stockbez_ID', Number(value))}
                                error={errors.stockbez_ID?.message}
                            />
                        </div>

                        <div className="min-w-0">
                            <label htmlFor="stocklaenge" className="block text-sm font-medium text-gray-700 mb-1">
                                Stocklänge (cm)
                            </label>
                            <input
                                type="number"
                                id="stocklaenge"
                                inputMode="numeric"
                                min="0"
                                max="180"
                                step="1"
                                placeholder="z. B. 120"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                {...register('stocklaenge', { valueAsNumber: true })}
                            />
                            {errors.stocklaenge && (
                                <p className="mt-1 text-sm text-red-600">{errors.stocklaenge.message}</p>
                            )}
                        </div>

                        {/* Optionale Bindungsdaten des Leihski */}
                        <div className="sm:col-span-2 space-y-3">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <Checkbox
                                    id="bindungAktiv"
                                    checked={bindungAktiv}
                                    onCheckedChange={(wert) => bindungUmschalten(wert === true)}
                                />
                                Bindungsdaten erfassen
                            </label>
                            {bindungAktiv && (
                                <BindungsdatenFelder
                                    idPrefix="verleih-bindung"
                                    wert={watch('bindungsEingabe')}
                                    onChange={setBindung}
                                    kundeId={kundeId ?? kunde?.ID}
                                />
                            )}
                        </div>

                        {/* Button */}
                        <div className="sm:col-span-2 flex sm:justify-end">
                            <button
                                type="submit"
                                disabled={!isFormValid}
                                className={`w-full sm:w-auto sm:min-w-48 py-2 px-6 rounded-md font-medium transition-colors ${
                                    isFormValid
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                {vorgabe ? 'Speichern' : 'Hinzufügen'}
                            </button>
                        </div>
                        {speicherFehler && (
                            <p className="sm:col-span-2 text-sm text-red-600">{speicherFehler}</p>
                        )}
                    </div>
                </form>

                {/* Material List, nur beim Anlegen eines neuen Verleihs */}
                {!onSpeichern && <div>
                    <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Ausgewähltes Material</h2>

                    {materialList.length === 0 ? (
                        <div className="text-gray-500 text-center py-6 sm:py-8 border-2 border-dashed border-gray-300 rounded-lg">
                            Noch kein Material ausgewählt
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <SaisonMaterialListe />
                        </div>
                    )}
                </div>}
            </div>
        </FormProvider>
    );
}