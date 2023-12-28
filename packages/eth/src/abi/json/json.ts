import type { Input } from "valibot"
import { array, parse, union } from "valibot"

import { errorSchema } from "../error"
import { eventSchema } from "../event"
import type { Function } from "../function"
import { constructorSchema, fallbackSchema, functionSchema, receiveSchema } from "../function"

export const jsonSchema = union([
  functionSchema,
  constructorSchema,
  receiveSchema,
  fallbackSchema,
  eventSchema,
  errorSchema,
])
export type Json = Input<typeof jsonSchema>

export function getInputs(_jsons: unknown): Json[] {
  return parse(array(jsonSchema), _jsons)
}

export function getFunctions(inputs: Json[]): Function[] {
  return parse(array(functionSchema), inputs.filter(input => input.type === "function"))
}
