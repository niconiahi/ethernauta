import { array, literal, merge, object, string, variant } from "valibot"

import { tupleSchema, typeSchema } from "../shared"

// TODO: this is the real type in need, but I have to solve the self-recursion problem
//       for now, tuple are allowed to be only one-dimensional
// export const error_tupleSchema = merge([
//   tupleSchema,
//   object({
//     components: array(error_inputSchema),
//   }),
// ])
export const error_tupleSchema = merge([
  tupleSchema,
  object({
    components: array(
      object({
        name: string(),
        type: typeSchema,
      }),
    ),
  }),
])
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
