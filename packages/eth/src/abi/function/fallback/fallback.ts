import { literal, object } from "valibot"

import { stateMutabilitySchema } from "../shared"

export const fallbackSchema = object({
  type: literal("fallback"),
  stateMutability: stateMutabilitySchema,
})
