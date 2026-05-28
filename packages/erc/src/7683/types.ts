// https://eips.ethereum.org/EIPS/eip-7683

import {
  AddressSchema,
  Bytes32Schema,
  BytesSchema,
  Uint32Schema,
  Uint256Schema,
} from "@ethernauta/core"
import { array, type InferOutput, object } from "valibot"

export const OutputSchema = object({
  token: Bytes32Schema,
  amount: Uint256Schema,
  recipient: Bytes32Schema,
  chainId: Uint256Schema,
})
export type Output = InferOutput<typeof OutputSchema>

export const FillInstructionSchema = object({
  destinationChainId: Uint256Schema,
  destinationSettler: Bytes32Schema,
  originData: BytesSchema,
})
export type FillInstruction = InferOutput<
  typeof FillInstructionSchema
>

// Per the ERC-7683 ABI:
//   open((uint32 fillDeadline, bytes32 orderDataType, bytes orderData))
//   openFor((address, address, uint256 nonce, uint256 originChainId,
//            uint32 openDeadline, uint32 fillDeadline, bytes32, bytes), ...)
// `openDeadline` / `fillDeadline` are unix-second uint32 timestamps;
// `nonce` / `originChainId` are uint256.
export const OnchainCrossChainOrderSchema = object({
  fillDeadline: Uint32Schema,
  orderDataType: Bytes32Schema,
  orderData: BytesSchema,
})
export type OnchainCrossChainOrder = InferOutput<
  typeof OnchainCrossChainOrderSchema
>

export const GaslessCrossChainOrderSchema = object({
  originSettler: AddressSchema,
  user: AddressSchema,
  nonce: Uint256Schema,
  originChainId: Uint256Schema,
  openDeadline: Uint32Schema,
  fillDeadline: Uint32Schema,
  orderDataType: Bytes32Schema,
  orderData: BytesSchema,
})
export type GaslessCrossChainOrder = InferOutput<
  typeof GaslessCrossChainOrderSchema
>

export const ResolvedCrossChainOrderSchema = object({
  user: AddressSchema,
  originChainId: Uint256Schema,
  openDeadline: Uint32Schema,
  fillDeadline: Uint32Schema,
  orderId: Bytes32Schema,
  maxSpent: array(OutputSchema),
  minReceived: array(OutputSchema),
  fillInstructions: array(FillInstructionSchema),
})
export type ResolvedCrossChainOrder = InferOutput<
  typeof ResolvedCrossChainOrderSchema
>
