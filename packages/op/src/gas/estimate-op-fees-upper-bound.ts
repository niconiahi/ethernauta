// https://specs.optimism.io/protocol/exec-engine.html#l1-cost-fees-l1-fee-vault
//
// Pessimistic OP-stack fee estimator for pre-sign UX. Calls
// `GasPriceOracle.getL1FeeUpperBound(uint256)` — a method
// designed for wallets that need to show a "max fee" before
// the full transaction envelope is known (no nonce, no gas
// limit). The upper bound is intentionally padded above the
// accurate fee so it can be promised as a ceiling. Costs one
// RPC instead of `estimate_op_fees`'s four — a meaningful
// win on mobile / poor RPC contexts.
//
// Independent of `estimate_op_fees`: the two helpers compute
// different things (pessimistic vs accurate) so no shared
// cache. Operator fee is intentionally omitted — the upper-
// bound contract covers L1 data only; wallets that need the
// operator-fee component should defer to `estimate_op_fees`.

import {
  type Address,
  AddressSchema,
  type Bytes,
  BytesSchema,
  type Uint,
  Uint256Schema,
  UintSchema,
} from "@ethernauta/core"
import {
  encode_transaction_unsigned,
  Transaction1559UnsignedSchema,
} from "@ethernauta/eip/1559"
import {
  estimate_1559_fees,
  eth_call,
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

import {
  GAS_PRICE_ORACLE_ADDRESS,
  getL1FeeUpperBound,
} from "../predeploys/gas-price-oracle"

const PercentileSchema = pipe(
  number(),
  minValue(0),
  maxValue(100),
)
const MultiplierSchema = pipe(number(), minValue(1))

export const EstimateOpFeesUpperBoundParametersSchema =
  object({
    tx: object({
      to: AddressSchema,
      value: optional(UintSchema),
      input: optional(BytesSchema),
    }),
    base_fee_multiplier: MultiplierSchema,
    priority_percentile: PercentileSchema,
  })
export type EstimateOpFeesUpperBoundParameters =
  InferOutput<
    typeof EstimateOpFeesUpperBoundParametersSchema
  >

export const OpFeesUpperBoundSchema = object({
  base_fee_per_gas: UintSchema,
  max_priority_fee_per_gas: UintSchema,
  max_fee_per_gas: UintSchema,
  l1_fee_upper_bound: UintSchema,
})
export type OpFeesUpperBound = InferOutput<
  typeof OpFeesUpperBoundSchema
>

const ZERO_UINT: Uint = parse(UintSchema, "0x0")
const EMPTY_BYTES: Bytes = parse(BytesSchema, "0x")
// `getL1FeeUpperBound`'s contract only reads the byte length
// of the RLP — the actual nonce / gas / fee values are
// throwaways. Pick small fixed values so the encoder
// succeeds; the resulting length stays within the bounds the
// real transaction will ultimately produce, which is what
// the upper-bound formula is calibrated against.
const PLACEHOLDER_GAS: Uint = parse(UintSchema, "0x5208")
const PLACEHOLDER_FEE: Uint = parse(UintSchema, "0x1")
const PLACEHOLDER_NONCE: Uint = parse(UintSchema, "0x0")

function reference_to_uint(_reference: string): Uint {
  const big = BigInt(_reference)
  return parse(UintSchema, `0x${big.toString(16)}`)
}

export function estimate_op_fees_upper_bound(
  _parameters: EstimateOpFeesUpperBoundParameters,
): Readable<OpFeesUpperBound> {
  return async (
    resolved: ResolvedReader,
  ): Promise<OpFeesUpperBound> => {
    const parameters = parse(
      EstimateOpFeesUpperBoundParametersSchema,
      _parameters,
    )
    const { reference } = decode_chain_id(
      resolved[1].chain_id,
    )
    const chain_id = reference_to_uint(reference)
    const to: Address = parameters.tx.to
    const value = parameters.tx.value ?? ZERO_UINT
    const input = parameters.tx.input ?? EMPTY_BYTES

    const unsigned = parse(Transaction1559UnsignedSchema, {
      type: parse(UintSchema, "0x2"),
      chainId: chain_id,
      nonce: PLACEHOLDER_NONCE,
      maxPriorityFeePerGas: PLACEHOLDER_FEE,
      maxFeePerGas: PLACEHOLDER_FEE,
      gas: PLACEHOLDER_GAS,
      to,
      value,
      input,
      gasPrice: ZERO_UINT,
      accessList: [],
    })
    const unsigned_bytes =
      encode_transaction_unsigned(unsigned)
    const byte_length = parse(
      Uint256Schema,
      `0x${unsigned_bytes.length.toString(16).padStart(64, "0")}`,
    )
    const upper_bound_callable = getL1FeeUpperBound({
      _unsignedTxSize: byte_length,
    })({
      chain_id: resolved[1].chain_id,
      to: GAS_PRICE_ORACLE_ADDRESS,
    })

    const [fees_1559, l1_upper_256] = await Promise.all([
      estimate_1559_fees({
        base_fee_multiplier: parameters.base_fee_multiplier,
        priority_percentile: parameters.priority_percentile,
      })(resolved),
      eth_call([
        {
          to: GAS_PRICE_ORACLE_ADDRESS,
          input: upper_bound_callable.data,
        },
      ])(resolved).then(upper_bound_callable.decode),
    ])

    const l1_fee_upper_bound = parse(
      UintSchema,
      `0x${BigInt(l1_upper_256).toString(16)}`,
    )

    return parse(OpFeesUpperBoundSchema, {
      base_fee_per_gas: fees_1559.base_fee_per_gas,
      max_priority_fee_per_gas:
        fees_1559.max_priority_fee_per_gas,
      max_fee_per_gas: fees_1559.max_fee_per_gas,
      l1_fee_upper_bound,
    })
  }
}
