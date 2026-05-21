import {
  address,
  array,
  bool,
  bytes,
  encode_function_call,
  tuple,
} from "@ethernauta/abi"
import {
  type Address,
  addressSchema,
  type Bytes,
  bytesSchema,
} from "@ethernauta/core"
import {
  bytes_to_hex,
  hex_to_bytes,
} from "@ethernauta/utils"
import { parse } from "valibot"
import { callSchema as rpcCallSchema } from "./call"
import type { Callable } from "./contract"
import {
  type ChainEntry,
  require_chain,
} from "./require-chain"

// Canonical Multicall deployment (mds1/multicall, deployed via CREATE2
// to the same address on every mainstream EVM chain). For chains where
// it lives at a different address (zkSync Era, a few niche L2s), this
// constant would need an override registry — out of v1 scope.
const MULTICALL_ADDRESS: Address = parse(
  addressSchema,
  "0xcA11bde05977b3631167028862bE2a173976CA11",
)

// Inner call tuple: `(address target, bool allowFailure, bytes callData)`.
// Solidity field order — wire layout matches this declaration.
const callSchema = tuple({
  target: address(),
  allowFailure: bool(),
  callData: bytes(),
})

// Per-call result tuple: `(bool success, bytes returnData)`.
const resultSchema = tuple({
  success: bool(),
  returnData: bytes(),
})

type MulticallOptions = {
  allow_failure?: boolean
}

type ValuesOf<T extends readonly Callable<unknown>[]> = {
  [K in keyof T]: T[K] extends Callable<infer U> ? U : never
}

type ResultsOf<T extends readonly Callable<unknown>[]> = {
  [K in keyof T]: T[K] extends Callable<infer U>
    ? { success: boolean; value: U | undefined }
    : never
}

export function create_multicall(_chains: ChainEntry[]): {
  <T extends readonly Callable<unknown>[]>(
    _calls: T,
  ): Promise<ValuesOf<T>>
  <T extends readonly Callable<unknown>[]>(
    _calls: T,
    _options: { allow_failure: true },
  ): Promise<ResultsOf<T>>
  <T extends readonly Callable<unknown>[]>(
    _calls: T,
    _options: { allow_failure: false },
  ): Promise<ValuesOf<T>>
} {
  async function multicall(
    _calls: readonly Callable<unknown>[],
    _options: MulticallOptions = {},
  ): Promise<unknown[]> {
    if (_calls.length === 0) {
      throw new Error(
        "multicall: requires at least one call",
      )
    }
    const chain_id = (_calls[0] as Callable<unknown>)
      .chain_id
    for (let i = 1; i < _calls.length; i++) {
      const c = _calls[i] as Callable<unknown>
      if (c.chain_id !== chain_id) {
        throw new Error(
          `multicall: chain mismatch (index 0 = ${chain_id}, index ${i} = ${c.chain_id})`,
        )
      }
    }
    const allow_failure = _options.allow_failure ?? false
    const calldata = encode_function_call({
      name: "aggregate3",
      args: [array(callSchema)] as const,
      values: [
        _calls.map((c) => ({
          target: c.to,
          allowFailure: allow_failure,
          callData: c.data,
        })),
      ] as never,
    })
    const transports = require_chain(_chains, chain_id)
    const rpc_call = parse(rpcCallSchema, [
      "eth_call",
      [
        {
          to: MULTICALL_ADDRESS,
          input: bytes_to_hex(calldata),
        },
        "latest",
      ],
    ])
    const response = await Promise.any(
      transports.map((t) => t(rpc_call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result_hex = parse(bytesSchema, response.result)
    const results = decode_aggregate_result(result_hex)
    return _calls.map((c, i) => {
      const r = results[i] as {
        success: boolean
        returnData: Bytes
      }
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
  // biome-ignore lint/suspicious/noExplicitAny: overload widening
  return multicall as any
}

// The `eth_call` return for `aggregate3((address,bool,bytes)[])` is a
// single dynamic-array argument. Top-level layout:
//   [offset_to_array (32B)][...result-array body]
// The offset (always 0x20 in practice) points past itself to the
// length-prefixed body that `array(resultSchema).decode` reads.
function decode_aggregate_result(
  _hex: Bytes,
): Array<{ success: boolean; returnData: Bytes }> {
  const data = hex_to_bytes(_hex)
  let offset = 0n
  for (let i = 0; i < 32; i++) {
    offset = (offset << 8n) | BigInt(data[i] as number)
  }
  return array(resultSchema).decode(
    data,
    Number(offset),
  ) as Array<{ success: boolean; returnData: Bytes }>
}
