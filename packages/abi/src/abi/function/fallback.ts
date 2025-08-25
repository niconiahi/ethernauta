import { literal, object } from "valibot"
import { stateMutabilitySchema } from "./function-shared"

export const fallbackSchema = object({
  type: literal("fallback"),
  stateMutability: stateMutabilitySchema,
})
