import { object } from "valibot"
import { stateMutabilitySchema } from "../shared"
import { typeSchema } from "../../shared"

export const receiveSchema = object({
  type: typeSchema,
  stateMutability: stateMutabilitySchema,
})
