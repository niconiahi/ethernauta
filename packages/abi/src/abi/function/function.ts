import type { InferOutput } from "valibot"
import { array, literal, object, string } from "valibot"
import {
  Function_inputSchema,
  Function_outputSchema,
  StateMutabilitySchema,
} from "./function-shared"

export const FunctionSchema = object({
  type: literal("function"),
  name: string(),
  inputs: array(Function_inputSchema),
  outputs: array(Function_outputSchema),
  stateMutability: StateMutabilitySchema,
})
export type _Function = InferOutput<typeof FunctionSchema>
