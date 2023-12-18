import type { Input } from "valibot"
import { union } from "valibot"

import { errorSchema } from "../error"
import { eventSchema } from "../event"
import { constructorSchema, fallbackSchema, functionSchema, receiveSchema } from "../function"

export const jsonSchema = union([
  functionSchema,
  constructorSchema,
  receiveSchema,
  fallbackSchema,
  eventSchema,
  errorSchema,
])
export type Json = Input<typeof jsonSchema>
