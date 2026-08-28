import { z } from "zod";
import { ApiAntwort } from "@/types/actiontypes";

export function toApiAntwort<T>(
    result: z.ZodSafeParseResult<T>,
    fehlerText: string
): ApiAntwort<T> {
    if (!result.success) {
        console.error("Validierungsfehler:", result.error);
        return { success: false, error: fehlerText };
    }

    return { success: true, data: result.data };
}