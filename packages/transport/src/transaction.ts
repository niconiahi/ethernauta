import * as v from "valibot"

export const transactionStatusSchema = v.union([
  v.literal("idle"),
  v.literal("pending"),
  v.literal("mined"),
  v.literal("confirmed"),
  v.literal("reverted"),
  v.literal("dropped"),
  v.literal("rejected"),
])
export const transactionSchema = v.object({
  status: transactionStatusSchema,
})
export type Transaction = v.InferOutput<
  typeof transactionSchema
>
