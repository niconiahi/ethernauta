import { array, type InferOutput, object } from "valibot"
import { addressSchema, uintSchema } from "../base"

export const authorizationSchema = object({
  chainId: uintSchema,
  address: addressSchema,
  nonce: uintSchema,
  yParity: uintSchema,
  r: uintSchema,
  s: uintSchema,
})
export type Authorization = InferOutput<
  typeof authorizationSchema
>

export const authorizationListSchema = array(
  authorizationSchema,
)
export type AuthorizationList = InferOutput<
  typeof authorizationListSchema
>
