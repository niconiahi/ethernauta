import { array, literal, object } from "valibot"
import {
  Function_inputSchema,
  StateMutabilitySchema,
} from "./function-shared"

export const ConstructorSchema = object({
  type: literal("constructor"),
  inputs: array(Function_inputSchema),
  stateMutability: StateMutabilitySchema,
})
