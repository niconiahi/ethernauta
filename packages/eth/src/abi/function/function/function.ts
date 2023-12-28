import type { Input } from "valibot"
import { array, literal, object, string } from "valibot"

import { function_inputSchema, function_outputSchema, stateMutabilitySchema } from "../shared"

export const functionSchema = object({
  type: literal("function"),
  name: string(),
  inputs: array(function_inputSchema),
  outputs: array(function_outputSchema),
  stateMutability: stateMutabilitySchema,
})
export type Function = Input<typeof functionSchema>
