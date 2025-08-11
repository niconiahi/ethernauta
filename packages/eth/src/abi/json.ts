import type { InferOutput } from "valibot"
import { array, parse, union } from "valibot"

import { errorSchema } from "./error"
import { eventSchema } from "./event"
import type { _Function } from "./function"
import {
  constructorSchema,
  fallbackSchema,
  functionSchema,
  receiveSchema,
} from "./function"

export const jsonSchema = union([
  functionSchema,
  constructorSchema,
  receiveSchema,
  fallbackSchema,
  eventSchema,
  errorSchema,
])
export type Json = InferOutput<typeof jsonSchema>

export function getInputs(_jsons: unknown): Json[] {
  return parse(array(jsonSchema), _jsons)
}

export function getFunctions(inputs: Json[]): _Function[] {
  return parse(
    array(functionSchema),
    inputs.filter((input) => input.type === "function"),
  )
}
