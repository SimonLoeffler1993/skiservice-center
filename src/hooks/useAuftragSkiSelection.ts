import { useState, useCallback } from 'react';

type SkiListeProps = {
    mode: "single" | "multi";
};

export default function useAuftragSkiSelection({ mode }: SkiListeProps) {
    const [selectedSkiId, setSelectedSkiId] = useState<Set<number>>(new Set());

    const toggleSkiSelection = useCallback((skiId: number) => {
        setSelectedSkiId((prev) => {
            const newSet = new Set(prev);
            if (mode === "single") {
                newSet.clear();
            }
            if (newSet.has(skiId)) {
                newSet.delete(skiId);
            } else {
                newSet.add(skiId);
            }
            return newSet;
        });
    }, [mode]);

    const selectSki = useCallback((skiId: number) => {
        setSelectedSkiId(prev => {
            if (mode === "single") {
                // Wenn im Single-Select-Modus, setze die Auswahl auf das neue Ski und entferne alle anderen
                return new Set([skiId]); 
            }
            
            return new Set(prev).add(skiId);
        });
    }, [mode]);

    const getSelectedSkiIds = useCallback(() => {
        return Array.from(selectedSkiId);
    }, [selectedSkiId]);

    const clearSelection = useCallback(() => {
        setSelectedSkiId(new Set());
    }, []);
    

    return { toggleSkiSelection, selectSki, getSelectedSkiIds, clearSelection, selectedSkiId };
}