import { literal, union } from "valibot"

export const commitmentSchema = union([
  literal("confirmed"),
  literal("finalized"),
  literal("processed"),
])
