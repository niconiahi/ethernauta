import {
  array,
  boolean,
  literal,
  object,
  string,
  variant,
} from "valibot"

import { AbiInputSchema } from "./function/function-shared"
import { TupleSchema, TypeSchema } from "./shared"

// Solidity events can declare tuple params whose components are
// themselves tuples — reuse the recursive `AbiInputSchema` from the
// function side. The top-level event input keeps the `indexed` flag;
// inner components do not.
export const Event_tupleSchema = object({
  ...TupleSchema.entries,
  components: array(AbiInputSchema),
  indexed: boolean(),
})
export const Event_inputSchema = variant("type", [
  object({
    name: string(),
    type: TypeSchema,
    indexed: boolean(),
  }),
  Event_tupleSchema,
])
export const EventSchema = object({
  type: literal("event"),
  name: string(),
  inputs: array(Event_inputSchema),
  anonymous: boolean(),
})
