import { object } from "valibot"
import { stateMutabilitySchema } from "../shared"
import { typeSchema } from "../../shared"

export const fallbackSchema = object({
  type: typeSchema,
  stateMutability: stateMutabilitySchema,
})
