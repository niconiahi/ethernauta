import { array, object, string } from "valibot"
import { function_inputSchema, outputSchema, stateMutabilitySchema } from "../shared"
import { typeSchema } from "../../shared"

export const functionSchema = object({
  type: typeSchema,
  name: string(),
  inputs: array(function_inputSchema),
  outputs: array(outputSchema),
  stateMutability: stateMutabilitySchema,
})
