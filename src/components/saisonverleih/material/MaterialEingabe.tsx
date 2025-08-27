"use client";

import { Suspense, useState } from 'react';
import SaisonMaterialPreise from './SaisonMaterialPreise';
import SaisonMaterialSki from './SaisonMaterialSki';
import SaisonMaterialSchuh from './SaisonMaterialSchuh';

interface MaterialData {
    serviceGroesse: 'klein' | 'groß' | '';
    skiNr: string;
    interneSchuhNummer: string;
    skifahrerName: string;
}

interface MaterialItem extends MaterialData {
    id: string;
    timestamp: Date;
}

export default function MaterialEingabe() {
    const [materialData, setMaterialData] = useState<MaterialData>({
        serviceGroesse: '',
        skiNr: '',
        interneSchuhNummer: '',
        skifahrerName: ''
    });
    
    const [materialList, setMaterialList] = useState<MaterialItem[]>([]);

    const handleInputChange = (field: keyof MaterialData, value: string) => {
        setMaterialData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Add material to list
        const newMaterial: MaterialItem = {
            ...materialData,
            id: Date.now().toString(),
            timestamp: new Date()
        };
        
        setMaterialList(prev => [...prev, newMaterial]);
        
        // Reset form
        setMaterialData({
            serviceGroesse: '',
            skiNr: '',
            interneSchuhNummer: '',
            skifahrerName: ''
        });
    };
    
    const removeMaterial = (id: string) => {
        setMaterialList(prev => prev.filter(item => item.id !== id));
    };

    const isFormValid = materialData.serviceGroesse && 
                       materialData.skiNr && 
                       materialData.interneSchuhNummer && 
                       materialData.skifahrerName;

    return (
        <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Material Eingabe</h1>
            
            <form onSubmit={handleSubmit} className="mb-8">
                {/* Horizontal Layout for Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                    {/* Service Größe Combobox */}
                    <div>
                        {/* <label htmlFor="serviceGroesse" className="block text-sm font-medium text-gray-700 mb-1">
                            Service Größe
                        </label>
                        <select
                            id="serviceGroesse"
                            value={materialData.serviceGroesse}
                            onChange={(e) => handleInputChange('serviceGroesse', e.target.value as 'klein' | 'groß' | '')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value="">Wählen...</option>
                            <option value="klein">Klein</option>
                            <option value="groß">Groß</option>
                        </select> */}
                        <Suspense fallback={<div>Loading...</div>}>
                            <SaisonMaterialPreise />
                        </Suspense>
                    </div>

                    {/* Ski Nummer */}
                    <div>
                        <SaisonMaterialSki />
                        {/* <label htmlFor="skiNr" className="block text-sm font-medium text-gray-700 mb-1">
                            Ski Nr.
                        </label>
                        <input
                            type="text"
                            id="skiNr"
                            value={materialData.skiNr}
                            onChange={(e) => handleInputChange('skiNr', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ski Nummer"
                            required
                        /> */}
                    </div>

                    {/* Interne Schuh Nummer */}
                    <div>
                        <SaisonMaterialSchuh />
                        {/* <label htmlFor="interneSchuhNummer" className="block text-sm font-medium text-gray-700 mb-1">
                            Schuh Nr.
                        </label>
                        <input
                            type="text"
                            id="interneSchuhNummer"
                            value={materialData.interneSchuhNummer}
                            onChange={(e) => handleInputChange('interneSchuhNummer', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Schuh Nummer"
                            required
                        /> */}
                    </div>

                    {/* Name des Skifahrers */}
                    <div>
                        <label htmlFor="skifahrerName" className="block text-sm font-medium text-gray-700 mb-1">
                            Skifahrer Name
                        </label>
                        <input
                            type="text"
                            id="skifahrerName"
                            value={materialData.skifahrerName}
                            onChange={(e) => handleInputChange('skifahrerName', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Name eingeben"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-end">
                        <button
                            type="submit"
                            disabled={!isFormValid}
                            className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
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
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Ausgewähltes Material</h2>
                
                {materialList.length === 0 ? (
                    <div className="text-gray-500 text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                        Noch kein Material ausgewählt
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse bg-white border border-gray-300 rounded-lg">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">Service Größe</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">Ski Nr.</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">Schuh Nr.</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">Skifahrer</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">Aktion</th>
                                </tr>
                            </thead>
                            <tbody>
                                {materialList.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="border border-gray-300 px-4 py-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                item.serviceGroesse === 'klein' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {item.serviceGroesse}
                                            </span>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2 font-mono">{item.skiNr}</td>
                                        <td className="border border-gray-300 px-4 py-2 font-mono">{item.interneSchuhNummer}</td>
                                        <td className="border border-gray-300 px-4 py-2">{item.skifahrerName}</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <button
                                                onClick={() => removeMaterial(item.id)}
                                                className="text-red-600 hover:text-red-800 font-medium text-sm"
                                            >
                                                Entfernen
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}