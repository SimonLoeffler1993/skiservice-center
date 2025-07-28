import z from "zod";

export const terminalSchema = z.object({
    terminals: z.array(z.string())
  });

export type Terminal = z.infer<typeof terminalSchema>;