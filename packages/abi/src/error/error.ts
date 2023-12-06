import { array, literal, object, string, union, variant } from "valibot"
import { typeSchema } from "../shared"

export const error_tupleSchema = object({
  name: string(),
  type: union([
    literal("tuple"),
    literal("tuple[]"),
  ]),
  components: array(typeSchema),
})
export const error_inputSchema = variant("type", [
  object({
    name: string(),
    type: typeSchema,
  }),
  error_tupleSchema,
])
export const errorSchema = object({
  type: literal("error"),
  name: string(),
  inputs: array(error_inputSchema),
})
