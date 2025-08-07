import { literal, object } from "valibot"
import { stateMutabilitySchema } from "./function-shared"

export const receiveSchema = object({
  type: literal("receive"),
  stateMutability: stateMutabilitySchema,
})
