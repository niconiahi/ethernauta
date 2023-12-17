import type { Input } from "valibot"
import { union } from "valibot"

import { errorSchema } from "../error"
import { eventSchema } from "../event"
import { functionSchema } from "../function"

export const jsonSchema = union([
  functionSchema,
  eventSchema,
  errorSchema,
])
export type Json = Input<typeof jsonSchema>
