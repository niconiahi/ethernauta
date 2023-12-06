import { array, boolean, literal, object, string, union, variant } from "valibot"
import { typeSchema } from "../shared"

export const event_tupleSchema = object({
  name: string(),
  type: union([
    literal("tuple"),
    literal("tuple[]"),
  ]),
  components: array(typeSchema),
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
