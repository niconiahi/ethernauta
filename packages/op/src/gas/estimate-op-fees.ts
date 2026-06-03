// Coarse OP-stack gas estimator. Composes the reads any L2 dapp
// needs before broadcasting on Base / Optimism / Mode / etc:
//
//   1. `eth_feeHistory` → L2 base fee + priority percentile
//   2. `eth_getTransactionCount` → nonce
//   3. `eth_estimateGas` → gas limit
//   4. `GasPriceOracle.isIsthmus()` → fork flag
//   5. `GasPriceOracle.getL1Fee(bytes)` → L1 data fee
//   6. `GasPriceOracle.getOperatorFee(uint256)` → operator fee
//      (Isthmus+ chains only — pre-Isthmus this returns 0)
//
// Fork-detect via the on-chain `isIsthmus()` flag rather than a
// hardcoded chain list — the boolean is the authoritative answer
// per chain, and the list would go stale as more chains upgrade.

import {
  type Address,
  AddressSchema,
  ByteSchema,
  type Bytes,
  BytesSchema,
  type Uint,
  Uint256Schema,
  UintSchema,
} from "@ethernauta/core"
import {
  estimate_1559_fees,
  eth_call,
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

import {
  GAS_PRICE_ORACLE_ADDRESS,
  getOperatorFee,
  isIsthmus,
} from "../predeploys/gas-price-oracle"
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
  operator_fee: UintSchema,
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

    // The four independent reads run in parallel. `eth_estimateGas`
    // needs a `from` to be realistic; we pass the destination because
    // the caller doesn't necessarily know which account will sign.
    // `isIsthmus()` decides whether the operator-fee component is
    // active on this chain — read it here so the conditional fee
    // call below doesn't add a serial round-trip.
    const isthmus_callable = isIsthmus()({
      chain_id: resolved[1].chain_id,
      to: GAS_PRICE_ORACLE_ADDRESS,
    })
    const [fees_1559, nonce, gas, isthmus_result] =
      await Promise.all([
        estimate_1559_fees({
          base_fee_multiplier:
            parameters.base_fee_multiplier,
          priority_percentile:
            parameters.priority_percentile,
        })(resolved),
        eth_getTransactionCount([to, "pending"])(resolved),
        eth_estimateGas([{ to, value, input }])(resolved),
        eth_call([
          {
            to: GAS_PRICE_ORACLE_ADDRESS,
            input: isthmus_callable.data,
          },
        ])(resolved),
      ])
    const is_isthmus =
      isthmus_callable.decode(isthmus_result)

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
    // `getOperatorFee(gasUsed)` returns the absolute operator-fee
    // wei for `gasUsed` units. Pre-Isthmus chains don't deploy the
    // method, so we skip the call entirely and return zero —
    // matching the protocol-level value on those chains.
    const gas_256 = parse(Uint256Schema, gas)
    const operator_fee_callable = getOperatorFee({
      _gasUsed: gas_256,
    })({
      chain_id: resolved[1].chain_id,
      to: GAS_PRICE_ORACLE_ADDRESS,
    })
    const [l1_fee_256, operator_fee_256] =
      await Promise.all([
        estimate_l1_fee({ tx: unsigned_tx })(resolved),
        is_isthmus
          ? eth_call([
              {
                to: GAS_PRICE_ORACLE_ADDRESS,
                input: operator_fee_callable.data,
              },
            ])(resolved).then(operator_fee_callable.decode)
          : Promise.resolve(parse(Uint256Schema, "0x0")),
      ])
    // Uint256 accepts the codec's 32-byte padded hex; Uint
    // requires compact form. Round-trip through BigInt to drop
    // leading zeros so the result-schema's stricter brand attaches.
    const l1_fee = parse(
      UintSchema,
      `0x${BigInt(l1_fee_256).toString(16)}`,
    )
    const operator_fee = parse(
      UintSchema,
      `0x${BigInt(operator_fee_256).toString(16)}`,
    )

    return parse(OpFeesSchema, {
      base_fee_per_gas: fees_1559.base_fee_per_gas,
      max_priority_fee_per_gas:
        fees_1559.max_priority_fee_per_gas,
      max_fee_per_gas: fees_1559.max_fee_per_gas,
      l1_fee,
      operator_fee,
    })
  }
}
