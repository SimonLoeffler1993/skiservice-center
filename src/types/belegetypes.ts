import { z } from "zod"

const BelegTypeSchema = z.enum([
  "salesinvoice",
  "salescreditnote",
  "purchaseinvoice",
  "purchasecreditnote",
  "invoice",
  "downpaymentinvoice",
  "creditnote",
  "orderconfirmation",
  "quotation",
  "deliverynote",
])

const BelegStatusSchema = z.enum([
  "draft",
  "open",
  "paid",
  "paidoff",
  "voided",
  "transferred",
  "sepadebit",
  "overdue",
  "accepted",
  "rejected",
  "unchecked",
])

export const BelegSchema = z.object({
  id: z.string().uuid(),
  voucherType: BelegTypeSchema,
  voucherStatus: BelegStatusSchema,
  voucherNumber: z.string(),
  voucherDate: z.string().datetime({ offset: true }),
  createdDate: z.string().datetime({ offset: true }),
  updatedDate: z.string().datetime({ offset: true }),
  dueDate: z.string().datetime({ offset: true }),
  contactId: z.string().uuid().nullable(),
  contactName: z.string(),
  totalAmount: z.number(),
  openAmount: z.number().nullable(),
  currency: z.literal("EUR"),
  archived: z.boolean(),
})

export const BelegListSchema = z.array(BelegSchema)

// Abgeleitete TypeScript-Typen
export type Beleg = z.infer<typeof BelegSchema>
export type BelegList = z.infer<typeof BelegListSchema>
export type BelegType = z.infer<typeof BelegTypeSchema>
export type BelegStatus = z.infer<typeof BelegStatusSchema>