import {
  array,
  boolean,
  literal,
  object,
  string,
  variant,
} from "valibot"

import { tupleComponentSchema } from "./function/function-shared"
import { tupleSchema, typeSchema } from "./shared"

// Solidity events can declare tuple params whose components are
// themselves tuples — reuse the recursive `tupleComponentSchema` from
// the function side. The top-level event input keeps the `indexed`
// flag; inner components do not.
export const event_tupleSchema = object({
  ...tupleSchema.entries,
  components: array(tupleComponentSchema),
  indexed: boolean(),
})
export const event_inputSchema = variant("type", [
  object({
    name: string(),
    type: typeSchema,
    indexed: boolean(),
  }),
  event_tupleSchema,
])
export const eventSchema = object({
  type: literal("event"),
  name: string(),
  inputs: array(event_inputSchema),
  anonymous: boolean(),
})
