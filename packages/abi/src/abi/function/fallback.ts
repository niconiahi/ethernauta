import { literal, object } from "valibot"
import { StateMutabilitySchema } from "./function-shared"

export const FallbackSchema = object({
  type: literal("fallback"),
  stateMutability: StateMutabilitySchema,
})
