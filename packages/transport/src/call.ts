import type { InferOutput } from "valibot"
import { tuple, union } from "valibot"

import { MethodSchema, ParametersSchema } from "./json-rpc"

export const CallSchema = union([
  tuple([MethodSchema, ParametersSchema]),
  tuple([MethodSchema]),
])
export type Call = InferOutput<typeof CallSchema>
