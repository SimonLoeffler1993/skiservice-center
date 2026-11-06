import { z } from "zod";

// Reihenfolge der Listen: zuletzt oder zuerst erfasste oben
export const ListenSortierungSchema = z.enum(["neueste", "aelteste"]);

export type ListenSortierung = z.infer<typeof ListenSortierungSchema>;
