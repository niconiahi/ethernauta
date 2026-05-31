// Coarse OP-stack gas estimator. Composes the four reads any L2
// dapp needs before broadcasting on Base / Optimism / Mode / etc:
//
//   1. `eth_feeHistory` → L2 base fee + priority percentile
//   2. `eth_getTransactionCount` → nonce
//   3. `eth_estimateGas` → gas limit
//   4. `GasPriceOracle.getL1Fee(bytes)` → L1 data fee
//
// Returns the 1559 fee triple plus the L1 surcharge so callers can
// render the user-facing "this transaction costs you X wei" before
// they sign.

import {
  type Address,
  AddressSchema,
  ByteSchema,
  type Bytes,
  BytesSchema,
  type Uint,
  type Uint256,
  UintSchema,
} from "@ethernauta/core"
import {
  estimate_1559_fees,
  eth_estimateGas,
  eth_getTransactionCount,
} from "@ethernauta/eth"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { decode_chain_id } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import {
  maxValue,
  minValue,
  number,
  object,
  optional,
  parse,
  pipe,
} from "valibot"

import { estimate_l1_fee } from "./estimate-l1-fee"

const PercentileSchema = pipe(
  number(),
  minValue(0),
  maxValue(100),
)
const MultiplierSchema = pipe(number(), minValue(1))

export const EstimateOpFeesParametersSchema = object({
  tx: object({
    to: AddressSchema,
    value: optional(UintSchema),
    input: optional(BytesSchema),
  }),
  base_fee_multiplier: MultiplierSchema,
  priority_percentile: PercentileSchema,
})
export type EstimateOpFeesParameters = InferOutput<
  typeof EstimateOpFeesParametersSchema
>

export const OpFeesSchema = object({
  base_fee_per_gas: UintSchema,
  max_priority_fee_per_gas: UintSchema,
  max_fee_per_gas: UintSchema,
  l1_fee: UintSchema,
})
export type OpFees = InferOutput<typeof OpFeesSchema>

const ZERO_UINT: Uint = parse(UintSchema, "0x0")
const EMPTY_BYTES: Bytes = parse(BytesSchema, "0x")
const TYPE_2: InferOutput<typeof ByteSchema> = parse(
  ByteSchema,
  "0x2",
)
// EIP-155 chain references are decimal strings ("1", "8453", …).
// `BigInt(reference)` parses them; `\`0x${...}\`` rebrands to the
// uint schema's hex shape so the encoder consumes a branded value.
function reference_to_uint(_reference: string): Uint {
  const big = BigInt(_reference)
  return parse(UintSchema, `0x${big.toString(16)}`)
}

export function estimate_op_fees(
  _parameters: EstimateOpFeesParameters,
): Readable<OpFees> {
  return async (
    resolved: ResolvedReader,
  ): Promise<OpFees> => {
    const parameters = parse(
      EstimateOpFeesParametersSchema,
      _parameters,
    )
    const { reference } = decode_chain_id(
      resolved[1].chain_id,
    )
    const chain_id = reference_to_uint(reference)
    const to: Address = parameters.tx.to
    const value = parameters.tx.value ?? ZERO_UINT
    const input = parameters.tx.input ?? EMPTY_BYTES

    // The three independent reads run in parallel. `eth_estimateGas`
    // needs a `from` to be realistic; we pass the destination because
    // the caller doesn't necessarily know which account will sign.
    const [fees_1559, nonce, gas] = await Promise.all([
      estimate_1559_fees({
        base_fee_multiplier: parameters.base_fee_multiplier,
        priority_percentile: parameters.priority_percentile,
      })(resolved),
      eth_getTransactionCount([to, "pending"])(resolved),
      eth_estimateGas([{ to, value, input }])(resolved),
    ])

    // Build the unsigned 1559 RLP. `accessList: []` mirrors what every
    // major wallet sends when the caller doesn't specify one — the
    // L1 fee depends on the byte count and zero-byte ratio of this
    // serialization, so an absent access list is the right default.
    const unsigned_tx = {
      type: TYPE_2,
      chainId: chain_id,
      nonce,
      maxPriorityFeePerGas:
        fees_1559.max_priority_fee_per_gas,
      maxFeePerGas: fees_1559.max_fee_per_gas,
      gas,
      to,
      value,
      input,
      gasPrice: ZERO_UINT,
      accessList: [],
    }
    const l1_fee_256: Uint256 = await estimate_l1_fee({
      tx: unsigned_tx,
    })(resolved)
    // Uint256 accepts the codec's 32-byte padded hex; Uint
    // requires compact form. Round-trip through BigInt to drop
    // leading zeros so the result-schema's stricter brand attaches.
    const l1_fee = parse(
      UintSchema,
      `0x${BigInt(l1_fee_256).toString(16)}`,
    )

    return parse(OpFeesSchema, {
      base_fee_per_gas: fees_1559.base_fee_per_gas,
      max_priority_fee_per_gas:
        fees_1559.max_priority_fee_per_gas,
      max_fee_per_gas: fees_1559.max_fee_per_gas,
      l1_fee,
    })
  }
}
