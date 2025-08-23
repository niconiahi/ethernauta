import type { InferOutput } from "valibot"
import { union } from "valibot"

import { errorSchema } from "./error"
import { eventSchema } from "./event"
import {
  constructorSchema,
  fallbackSchema,
  functionSchema,
  receiveSchema,
} from "./function"

export const DescriptionSchema = union([
  functionSchema,
  constructorSchema,
  receiveSchema,
  fallbackSchema,
  eventSchema,
  errorSchema,
])
export type Description = InferOutput<
  typeof DescriptionSchema
>
