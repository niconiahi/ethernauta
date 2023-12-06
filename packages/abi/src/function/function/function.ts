import { array, literal, object, string } from "valibot"
import { function_inputSchema, outputSchema, stateMutabilitySchema } from "../shared"

export const functionSchema = object({
  type: literal("function"),
  name: string(),
  inputs: array(function_inputSchema),
  outputs: array(outputSchema),
  stateMutability: stateMutabilitySchema,
})
