import { array, boolean, literal, merge, object, string, variant } from "valibot"
import { tupleSchema, typeSchema } from "../shared"

// export const event_tupleSchema = merge([
//   tupleSchema,
//   object({
//     components: array(event_inputSchema),
//     indexed: boolean(),
//   }),
// ])
export const event_tupleSchema = merge([
  tupleSchema,
  object({
    components: array(
      object({
        name: string(),
        type: typeSchema,
      }),
    ),
    indexed: boolean(),
  }),
])
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
