import { create } from 'zustand';

import { Kunde } from "@/types/skikundentypes";

type KundeStore = {
    kunde: Kunde | null;
    setKunde: (kunde: Kunde | null) => void;
};

export const useKundeStore = create<KundeStore>((set) => ({
    kunde: null,
    setKunde: (kunde) => set({ kunde }),
}));