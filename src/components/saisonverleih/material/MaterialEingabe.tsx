"use client";

import { Suspense, useState } from 'react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import SaisonMaterialPreise from './SaisonMaterialPreise';
import SaisonMaterialSki from './SaisonMaterialSki';
import SaisonMaterialSchuh from './SaisonMaterialSchuh';
import SaisonMaterialStock from './SaisonMaterialStock';
import { MaterialSchema } from '@/types/materialtypes';
import SaisonMaterialListe from './SaisonMaterialListe';
import { useSaisonverleihContext } from '@/context/saisonverleih-context';

// TODO: Teilweise auf Register umstellen

type MaterialFormData = z.infer<typeof MaterialSchema>;

export default function MaterialEingabe() {
    const [skiValid, setSkiValid] = useState<boolean | null>(null);
    const [schuhValid, setSchuhValid] = useState<boolean | null>(null);
    const { materialList, setMaterialList } = useSaisonverleihContext();

    const methods = useForm<MaterialFormData>({
        resolver: zodResolver(MaterialSchema),
        mode: 'onChange',
        defaultValues: {
            Preis: 0,
            skinr: '',
            stockbez_ID: 0,
            stocklaenge: 0,
            schuhnr: undefined,
            SkiFahrerName: '',
        }
    });

    const { register, handleSubmit, reset, setValue, watch, formState: { errors, isValid: isFormValid } } = methods;

    const onSubmit: SubmitHandler<MaterialFormData> = (data) => {
        if (skiValid === false || schuhValid === false) {
            alert('Bitte überprüfen Sie die Ski- und Schuh-Nummern auf Gültigkeit');
            return;
        }

        setMaterialList([...materialList, data]);
        reset();
        setSkiValid(null);
        setSchuhValid(null);
    };

    return (
        <FormProvider {...methods}>
            <div className="p-4 sm:p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-md">
                <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">Material Eingabe</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="mb-6 sm:mb-8">
                    {/* Mobil: 1 Spalte | ab sm: 2er-Reihen */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5 mb-4 items-start">
                        {/* Reihe 1: Preis | Skifahrer Name */}
                        <div className="min-w-0">
                            <Suspense fallback={<div>Lade Service-Optionen...</div>}>
                                <SaisonMaterialPreise
                                    name="Preis"
                                    error={errors.Preis?.message}
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
                                {...register('SkiFahrerName')}
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
                                error={errors.skinr?.message}
                            />
                        </div>

                        <div className="min-w-0">
                            <SaisonMaterialSchuh
                                value={watch('schuhnr') !== undefined ? String(watch('schuhnr')) : ''}
                                onChange={(value) => setValue('schuhnr', value.trim() === '' ? undefined : Number(value), { shouldValidate: true })}
                                onCheck={setSchuhValid}
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
                                Hinzufügen
                            </button>
                        </div>
                    </div>
                </form>

                {/* Material List */}
                <div>
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
                </div>
            </div>
        </FormProvider>
    );
}