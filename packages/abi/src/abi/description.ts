import type { InferOutput } from "valibot"
import { union } from "valibot"

import { ErrorSchema } from "./error"
import { EventSchema } from "./event"
import {
  ConstructorSchema,
  FallbackSchema,
  FunctionSchema,
  ReceiveSchema,
} from "./function"

export const DescriptionSchema = union([
  FunctionSchema,
  ConstructorSchema,
  ReceiveSchema,
  FallbackSchema,
  EventSchema,
  ErrorSchema,
])
export type Description = InferOutput<
  typeof DescriptionSchema
>
