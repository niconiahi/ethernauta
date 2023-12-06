import { array, object } from "valibot"
import { function_inputSchema, stateMutabilitySchema } from "../shared"
import { typeSchema } from "../../shared"

export const constructorSchema = object({
  type: typeSchema,
  inputs: array(function_inputSchema),
  stateMutability: stateMutabilitySchema,
})
