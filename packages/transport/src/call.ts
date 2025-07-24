import type { InferOutput } from "valibot"
import { tuple, union } from "valibot"

import { methodSchema, parametersSchema } from "./json-rpc"

export const callSchema = union([
  tuple([methodSchema, parametersSchema]),
  tuple([methodSchema]),
])
export type Call = InferOutput<typeof callSchema>
