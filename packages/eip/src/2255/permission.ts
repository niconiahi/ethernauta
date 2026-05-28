// https://eips.ethereum.org/EIPS/eip-2255

import {
  array,
  type InferOutput,
  number,
  object,
  optional,
  record,
  string,
  unknown,
} from "valibot"

export const CaveatSchema = object({
  type: string(),
  value: unknown(),
})
export type Caveat = InferOutput<typeof CaveatSchema>

export const PermissionSchema = object({
  invoker: optional(string()),
  parentCapability: string(),
  caveats: array(CaveatSchema),
  date: optional(number()),
  id: optional(string()),
})
export type Permission = InferOutput<
  typeof PermissionSchema
>

export const RequestedPermissionSchema = record(
  string(),
  object({}),
)
export type RequestedPermissions = InferOutput<
  typeof RequestedPermissionSchema
>
