// https://eips.ethereum.org/EIPS/eip-7683

import {
  addressSchema,
  bytes32Schema,
  bytesSchema,
  uint256Schema,
  uint32Schema,
} from "@ethernauta/core"
import { array, type InferOutput, object } from "valibot"

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

// Per the ERC-7683 ABI:
//   open((uint32 fillDeadline, bytes32 orderDataType, bytes orderData))
//   openFor((address, address, uint256 nonce, uint256 originChainId,
//            uint32 openDeadline, uint32 fillDeadline, bytes32, bytes), ...)
// `openDeadline` / `fillDeadline` are unix-second uint32 timestamps;
// `nonce` / `originChainId` are uint256.
export const onchainCrossChainOrderSchema = object({
  fillDeadline: uint32Schema,
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
  openDeadline: uint32Schema,
  fillDeadline: uint32Schema,
  orderDataType: bytes32Schema,
  orderData: bytesSchema,
})
export type GaslessCrossChainOrder = InferOutput<
  typeof gaslessCrossChainOrderSchema
>

export const resolvedCrossChainOrderSchema = object({
  user: addressSchema,
  originChainId: uint256Schema,
  openDeadline: uint32Schema,
  fillDeadline: uint32Schema,
  orderId: bytes32Schema,
  maxSpent: array(outputSchema),
  minReceived: array(outputSchema),
  fillInstructions: array(fillInstructionSchema),
})
export type ResolvedCrossChainOrder = InferOutput<
  typeof resolvedCrossChainOrderSchema
>
