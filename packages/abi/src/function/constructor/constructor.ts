import { array, literal, object } from "valibot"

import { function_inputSchema, stateMutabilitySchema } from "../shared"

export const constructorSchema = object({
  type: literal("constructor"),
  inputs: array(function_inputSchema),
  stateMutability: stateMutabilitySchema,
})
