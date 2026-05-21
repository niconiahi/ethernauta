// https://eips.ethereum.org/EIPS/eip-7683

import {
  addressSchema,
  bytes32Schema,
  bytesSchema,
  uint256Schema,
} from "@ethernauta/core"
import {
  array,
  type InferOutput,
  object,
} from "valibot"

export const outputSchema = object({
  token: bytes32Schema,
  amount: uint256Schema,
  recipient: bytes32Schema,
  chainId: uint256Schema,
})
export type Output = InferOutput<typeof outputSchema>

export const fillInstructionSchema = object({
  destinationChainId: uint256Schema,
  destinationSettler: bytes32Schema,
  originData: bytesSchema,
})
export type FillInstruction = InferOutput<
  typeof fillInstructionSchema
>

export const onchainCrossChainOrderSchema = object({
  fillDeadline: uint256Schema,
  orderDataType: bytes32Schema,
  orderData: bytesSchema,
})
export type OnchainCrossChainOrder = InferOutput<
  typeof onchainCrossChainOrderSchema
>

export const gaslessCrossChainOrderSchema = object({
  originSettler: addressSchema,
  user: addressSchema,
  nonce: uint256Schema,
  originChainId: uint256Schema,
  openDeadline: uint256Schema,
  fillDeadline: uint256Schema,
  orderDataType: bytes32Schema,
  orderData: bytesSchema,
})
export type GaslessCrossChainOrder = InferOutput<
  typeof gaslessCrossChainOrderSchema
>

export const resolvedCrossChainOrderSchema = object({
  user: addressSchema,
  originChainId: uint256Schema,
  openDeadline: uint256Schema,
  fillDeadline: uint256Schema,
  orderId: bytes32Schema,
  maxSpent: array(outputSchema),
  minReceived: array(outputSchema),
  fillInstructions: array(fillInstructionSchema),
})
export type ResolvedCrossChainOrder = InferOutput<
  typeof resolvedCrossChainOrderSchema
>
