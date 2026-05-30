import {
  address,
  array,
  bool,
  bytes,
  encode_function_call,
  tuple,
} from "@ethernauta/abi"
import {
  AddressSchema,
  type Bytes,
  Bytes32Schema,
  BytesSchema,
} from "@ethernauta/core"
import {
  bytes_to_hex,
  hex_to_bytes,
} from "@ethernauta/utils"
import {
  boolean,
  custom,
  type InferOutput,
  object,
  optional,
  parse,
  tupleWithRest,
} from "valibot"
import { CallSchema as RpcCallSchema } from "./call"
import { ChainIdSchema } from "./chain/chain-id"
import type { Callable } from "./contract"
import { create_dispatcher } from "./dispatcher"
import {
  type ChainEntry,
  require_chain,
} from "./require-chain"

// Canonical Multicall deployment (mds1/multicall, deployed via CREATE2
// to the same address on every mainstream EVM chain). For chains where
// it lives at a different address (zkSync Era, a few niche L2s), this
// constant would need an override registry — out of v1 scope.
const MULTICALL_ADDRESS = parse(
  AddressSchema,
  "0xcA11bde05977b3631167028862bE2a173976CA11",
)

// Inner call tuple: `(address target, bool allowFailure, bytes callData)`.
// Solidity field order — wire layout matches this declaration.
const CallSchema = tuple({
  target: address(),
  allowFailure: bool(),
  callData: bytes(),
})

// Per-call result tuple: `(bool success, bytes returnData)`.
const ResultSchema = tuple({
  success: bool(),
  returnData: bytes(),
})

const MulticallOptionsSchema = object({
  allow_failure: optional(boolean()),
})
type MulticallOptions = InferOutput<
  typeof MulticallOptionsSchema
>

// Structural schema for `Callable<unknown>` (the function-bearing
// DI contract from `./contract`). Each data field gets its narrowest
// `@ethernauta/core` primitive; `decode` is a function so it falls
// back to `custom<F>(typeof === "function")` — the only way to
// validate a function value with Valibot.
const CallableSchema = object({
  chain_id: ChainIdSchema,
  to: AddressSchema,
  data: BytesSchema,
  decode: custom<(result: Bytes) => unknown>(
    (v) => typeof v === "function",
  ),
})

// Non-empty list of calls — `NonEmptyCallsSchema` produces
// `[Callable<unknown>, ...Callable<unknown>[]]`, so the parsed value
// destructures into a non-optional `first` (same pattern as
// `tupleWithRest([ChainSchema], ChainSchema)` for `CHAINS` in
// `packages/wallet/src/utils/chain.ts`).
const NonEmptyCallsSchema = tupleWithRest(
  [CallableSchema],
  CallableSchema,
)

type ValuesOf<T extends readonly Callable<unknown>[]> = {
  [K in keyof T]: T[K] extends Callable<infer U> ? U : never
}

type ResultsOf<T extends readonly Callable<unknown>[]> = {
  [K in keyof T]: T[K] extends Callable<infer U>
    ? { success: boolean; value: U | undefined }
    : never
}

export function create_multicall(_chains: ChainEntry[]) {
  function multicall<
    T extends readonly Callable<unknown>[],
  >(_calls: T): Promise<ValuesOf<T>>
  function multicall<
    T extends readonly Callable<unknown>[],
  >(
    _calls: T,
    _options: { allow_failure: true },
  ): Promise<ResultsOf<T>>
  function multicall<
    T extends readonly Callable<unknown>[],
  >(
    _calls: T,
    _options: { allow_failure: false },
  ): Promise<ValuesOf<T>>
  async function multicall(
    _calls: readonly Callable<unknown>[],
    _options: MulticallOptions = {},
  ): Promise<unknown[]> {
    const [first, ...rest] = parse(
      NonEmptyCallsSchema,
      _calls,
    )
    const chain_id = first.chain_id
    for (const [offset, c] of rest.entries()) {
      if (c.chain_id !== chain_id) {
        throw new Error(
          `multicall: chain mismatch (index 0 = ${chain_id}, index ${offset + 1} = ${c.chain_id})`,
        )
      }
    }
    const allow_failure = _options.allow_failure ?? false
    const calldata = encode_function_call({
      name: "aggregate3",
      args: [array(CallSchema)] as const,
      values: [
        _calls.map((c) => ({
          target: c.to,
          allowFailure: allow_failure,
          callData: c.data,
        })),
      ] as const,
    })
    const { transports, strategy } = require_chain(
      _chains,
      chain_id,
    )
    const dispatcher = create_dispatcher(
      transports,
      strategy,
    )
    const rpc_call = parse(RpcCallSchema, [
      "eth_call",
      [
        {
          to: MULTICALL_ADDRESS,
          input: bytes_to_hex(calldata),
        },
        "latest",
      ],
    ])
    const response = await dispatcher(rpc_call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result_hex = parse(BytesSchema, response.result)
    const results = decode_aggregate_result(result_hex)
    return _calls.map((c, i) => {
      // `parse` against the per-result Valibot schema turns the
      // `results[i] | undefined` widening from
      // `noUncheckedIndexedAccess` into a hard failure if the decode
      // returned fewer entries than `_calls` — keeps the runtime
      // contract aligned with the multicall ABI without an `as`.
      const r = parse(ResultSchema.schema, results[i])
      if (!r.success) {
        if (allow_failure) {
          return { success: false, value: undefined }
        }
        throw new Error(
          `multicall: call #${i} reverted (set { allow_failure: true } to read per-slot)`,
        )
      }
      const value = c.decode(r.returnData)
      return allow_failure
        ? { success: true, value }
        : value
    })
  }
  return multicall
}

// The `eth_call` return for `aggregate3((address,bool,bytes)[])` is a
// single dynamic-array argument. Top-level layout:
//   [offset_to_array (32B)][...result-array body]
// The offset (always 0x20 in practice) points past itself to the
// length-prefixed body that `array(ResultSchema).decode` reads.
function decode_aggregate_result(
  _hex: Bytes,
): Array<{ success: boolean; returnData: Bytes }> {
  const header_hex = parse(Bytes32Schema, _hex.slice(0, 66))
  const offset = BigInt(header_hex)
  const data = hex_to_bytes(_hex)
  return array(ResultSchema).decode(data, Number(offset))
}
