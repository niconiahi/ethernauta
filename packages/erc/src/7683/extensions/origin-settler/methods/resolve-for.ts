import {
  tuple as abi_tuple,
  address,
  array,
  bytes,
  bytes32,
  decode_function_result,
  encode_function_call,
  uint32,
  uint64,
  uint256,
} from "@ethernauta/abi"
import type {
  Address,
  Bytes,
  Bytes32,
  Uint32,
  Uint64,
  Uint256,
} from "@ethernauta/core"
import {
  addressSchema,
  bytes32Schema,
  bytesSchema,
  uint32Schema,
  uint64Schema,
  uint256Schema,
} from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import {
  object,
  parse,
  tuple,
  union,
  array as v_array,
} from "valibot"

const PARAM_CODECS = [
  abi_tuple({
    originSettler: address(),
    user: address(),
    nonce: uint256(),
    originChainId: uint256(),
    openDeadline: uint32(),
    fillDeadline: uint32(),
    orderDataType: bytes32(),
    orderData: bytes(),
  }),
  bytes(),
] as const
const OUTPUT_CODECS = [
  abi_tuple({
    user: address(),
    originChainId: uint256(),
    openDeadline: uint32(),
    fillDeadline: uint32(),
    orderId: bytes32(),
    maxSpent: array(
      abi_tuple({
        token: bytes32(),
        amount: uint256(),
        recipient: bytes32(),
        chainId: uint256(),
      }),
    ),
    minReceived: array(
      abi_tuple({
        token: bytes32(),
        amount: uint256(),
        recipient: bytes32(),
        chainId: uint256(),
      }),
    ),
    fillInstructions: array(
      abi_tuple({
        destinationChainId: uint64(),
        destinationSettler: bytes32(),
        originData: bytes(),
      }),
    ),
  }),
] as const

export const RESOLVE_FOR_SIGNATURE = {
  signature:
    "resolveFor((address,address,uint256,uint256,uint32,uint32,bytes32,bytes),bytes)",
  names: ["order", "originFillerData"],
}

const parametersSchema = union([
  tuple([
    object({
      originSettler: addressSchema,
      user: addressSchema,
      nonce: uint256Schema,
      originChainId: uint256Schema,
      openDeadline: uint32Schema,
      fillDeadline: uint32Schema,
      orderDataType: bytes32Schema,
      orderData: bytesSchema,
    }),
    bytesSchema,
  ]),
  object({
    order: object({
      originSettler: addressSchema,
      user: addressSchema,
      nonce: uint256Schema,
      originChainId: uint256Schema,
      openDeadline: uint32Schema,
      fillDeadline: uint32Schema,
      orderDataType: bytes32Schema,
      orderData: bytesSchema,
    }),
    originFillerData: bytesSchema,
  }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function resolveFor(_parameters: Parameters) {
  return (
    context: ContractContext,
  ): Callable<{
    user: Address
    originChainId: Uint256
    openDeadline: Uint32
    fillDeadline: Uint32
    orderId: Bytes32
    maxSpent: {
      token: Bytes32
      amount: Uint256
      recipient: Bytes32
      chainId: Uint256
    }[]
    minReceived: {
      token: Bytes32
      amount: Uint256
      recipient: Bytes32
      chainId: Uint256
    }[]
    fillInstructions: {
      destinationChainId: Uint64
      destinationSettler: Bytes32
      originData: Bytes
    }[]
  }> => {
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0], parameters[1]] as const)
      : ([
          parameters.order,
          parameters.originFillerData,
        ] as const)
    const calldata = encode_function_call({
      name: "resolveFor",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(bytesSchema, bytes_to_hex(calldata)),
      decode: (
        result: Bytes,
      ): {
        user: Address
        originChainId: Uint256
        openDeadline: Uint32
        fillDeadline: Uint32
        orderId: Bytes32
        maxSpent: {
          token: Bytes32
          amount: Uint256
          recipient: Bytes32
          chainId: Uint256
        }[]
        minReceived: {
          token: Bytes32
          amount: Uint256
          recipient: Bytes32
          chainId: Uint256
        }[]
        fillInstructions: {
          destinationChainId: Uint64
          destinationSettler: Bytes32
          originData: Bytes
        }[]
      } => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(
          object({
            user: addressSchema,
            originChainId: uint256Schema,
            openDeadline: uint32Schema,
            fillDeadline: uint32Schema,
            orderId: bytes32Schema,
            maxSpent: v_array(
              object({
                token: bytes32Schema,
                amount: uint256Schema,
                recipient: bytes32Schema,
                chainId: uint256Schema,
              }),
            ),
            minReceived: v_array(
              object({
                token: bytes32Schema,
                amount: uint256Schema,
                recipient: bytes32Schema,
                chainId: uint256Schema,
              }),
            ),
            fillInstructions: v_array(
              object({
                destinationChainId: uint64Schema,
                destinationSettler: bytes32Schema,
                originData: bytesSchema,
              }),
            ),
          }),
          decoded,
        )
      },
    }
  }
}
