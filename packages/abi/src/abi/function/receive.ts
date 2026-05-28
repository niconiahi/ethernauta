import { literal, object } from "valibot"
import { StateMutabilitySchema } from "./function-shared"

export const ReceiveSchema = object({
  type: literal("receive"),
  stateMutability: StateMutabilitySchema,
})
