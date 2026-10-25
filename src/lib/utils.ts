import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Beträge im deutschen Format, z.B. "1.234,50 €"
export const euro = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" })
