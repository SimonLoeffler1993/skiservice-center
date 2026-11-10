import { z } from "zod";

// Reihenfolge der Listen: zuletzt oder zuerst erfasste oben
export const ListenSortierungSchema = z.enum(["neueste", "aelteste"]);

export type ListenSortierung = z.infer<typeof ListenSortierungSchema>;

// Filter Bezahlt bzw. Benachrichtigt, ohne Angabe alle
export const JaNeinSchema = z.enum(["ja", "nein"]);

export type JaNein = z.infer<typeof JaNeinSchema>;
