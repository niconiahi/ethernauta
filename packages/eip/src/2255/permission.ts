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

export const caveatSchema = object({
  type: string(),
  value: unknown(),
})
export type Caveat = InferOutput<typeof caveatSchema>

export const permissionSchema = object({
  invoker: optional(string()),
  parentCapability: string(),
  caveats: array(caveatSchema),
  date: optional(number()),
  id: optional(string()),
})
export type Permission = InferOutput<
  typeof permissionSchema
>

export const requestedPermissionSchema = record(
  string(),
  object({}),
)
export type RequestedPermissions = InferOutput<
  typeof requestedPermissionSchema
>
