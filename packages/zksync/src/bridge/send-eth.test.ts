import {
  address as address_codec,
  array as array_codec,
  bytes as bytes_codec,
  encode_function_call,
  function_selector,
  tuple as tuple_codec,
  uint256 as uint256_codec,
} from "@ethernauta/abi"
import {
  AddressSchema,
  type Bytes,
  BytesSchema,
  Hash32Schema,
  Uint256Schema,
  UintSchema,
} from "@ethernauta/core"
import type {
  Call,
  Reader,
  ResolvedBridge,
  Response,
  Signer,
} from "@ethernauta/transport"
import { encode_chain_id } from "@ethernauta/transport"
import {
  bigint_to_hex,
  bytes_to_hex,
} from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import {
  array,
  object,
  parse,
  string,
  tuple,
} from "valibot"
import { describe, expect, it } from "vitest"

import { send_eth } from "./send-eth"

const ERA_SEPOLIA = encode_chain_id({
  namespace: "eip155",
  reference: "300",
})
const SEPOLIA = encode_chain_id({
  namespace: "eip155",
  reference: "11155111",
})
// Era Sepolia Bridgehub — from packages/zksync/src/deploys/eip155-300.ts
const BRIDGEHUB = parse(
  AddressSchema,
  "0x35A54c8C757806eB6820629bc82d90E056394C92",
)
const RECIPIENT = parse(
  AddressSchema,
  "0x1111111111111111111111111111111111111111",
)
const SIGNED_TRANSACTION = parse(
  BytesSchema,
  "0x02f86c0184deadbeef841dcd6500841dcd6500825208941111111111111111111111111111111111111111880de0b6b3a764000080c001a01111111111111111111111111111111111111111111111111111111111111111a02222222222222222222222222222222222222222222222222222222222222222",
)
const RETURNED_HASH = parse(
  Hash32Schema,
  "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
)
// Mock L1 gas price (1 gwei) + mock base cost (0.0001 ETH).
const MOCK_GAS_PRICE = parse(UintSchema, "0x3b9aca00")
const MOCK_BASE_COST = parse(
  Uint256Schema,
  "0x5af3107a4000",
)

const REQUEST_STRUCT_TUPLE = tuple_codec({
  chainId: uint256_codec(),
  mintValue: uint256_codec(),
  l2Contract: address_codec(),
  l2Value: uint256_codec(),
  l2Calldata: bytes_codec(),
  l2GasLimit: uint256_codec(),
  l2GasPerPubdataByteLimit: uint256_codec(),
  factoryDeps: array_codec(bytes_codec()),
  refundRecipient: address_codec(),
})
const REQUEST_SIGNATURE =
  "requestL2TransactionDirect((uint256,uint256,address,uint256,bytes,uint256,uint256,bytes[],address))"
const REQUEST_SELECTOR = function_selector(
  "requestL2TransactionDirect",
  [REQUEST_STRUCT_TUPLE],
)
const BASE_COST_SELECTOR = function_selector(
  "l2TransactionBaseCost",
  [
    uint256_codec(),
    uint256_codec(),
    uint256_codec(),
    uint256_codec(),
  ],
)

const TxSchema = object({
  to: AddressSchema,
  value: UintSchema,
  input: BytesSchema,
  _ethernauta: object({
    function: object({
      signature: string(),
      names: array(string()),
    }),
  }),
})
type Tx = InferOutput<typeof TxSchema>
const SignParamsSchema = tuple([TxSchema])
const RawSendParamsSchema = tuple([BytesSchema])
const EthCallTxSchema = object({
  to: AddressSchema,
  input: BytesSchema,
})
const EthCallParamsSchema = tuple([EthCallTxSchema])

function pad32_uint(value: `0x${string}`): `0x${string}` {
  return `0x${value.slice(2).padStart(64, "0")}`
}

function build_resolved({
  signer,
  reader,
}: {
  signer?: Signer
  reader: Reader
}): ResolvedBridge {
  return {
    signer,
    l1: {
      chain_id: SEPOLIA,
      reader,
    },
    l2: {
      chain_id: ERA_SEPOLIA,
      reader: async (_call: Call): Promise<Response> => {
        throw new Error(
          "l2 reader should not be invoked from send_eth",
        )
      },
    },
  }
}

describe("send_eth", () => {
  it("reads Bridgehub.l2TransactionBaseCost, signs requestL2TransactionDirect with mintValue = amount + base_cost, and broadcasts via eth_sendRawTransaction", async () => {
    const signer_calls: { method: string; tx: Tx }[] = []
    const signer: Signer = async (method, _params) => {
      const [tx] = parse(SignParamsSchema, _params)
      signer_calls.push({ method, tx })
      return SIGNED_TRANSACTION
    }
    const eth_call_calls: { to: string; input: Bytes }[] =
      []
    const raw_send_calls: { bytes: Bytes }[] = []
    let gas_price_call_count = 0
    const reader: Reader = async (
      call: Call,
    ): Promise<Response> => {
      const [method, params] = call
      if (method === "eth_gasPrice") {
        gas_price_call_count++
        return {
          jsonrpc: "2.0",
          id: "1",
          result: MOCK_GAS_PRICE,
        }
      }
      if (method === "eth_call") {
        const [tx] = parse(EthCallParamsSchema, params)
        eth_call_calls.push({ to: tx.to, input: tx.input })
        return {
          jsonrpc: "2.0",
          id: "1",
          result: pad32_uint(MOCK_BASE_COST),
        }
      }
      if (method === "eth_sendRawTransaction") {
        const [bytes] = parse(RawSendParamsSchema, params)
        raw_send_calls.push({ bytes })
        return {
          jsonrpc: "2.0",
          id: "1",
          result: RETURNED_HASH,
        }
      }
      throw new Error(`unexpected method ${method}`)
    }
    const resolved = build_resolved({ signer, reader })
    const amount = parse(Uint256Schema, "0x38d7ea4c68000") // 0.001 ETH
    const hash = await send_eth({
      to: RECIPIENT,
      amount,
    })(resolved)
    expect(hash).toBe(RETURNED_HASH)

    expect(gas_price_call_count).toBe(1)

    expect(eth_call_calls.length).toBe(1)
    const base_cost_call = eth_call_calls[0]
    if (!base_cost_call)
      throw new Error("expected one eth_call")
    expect(base_cost_call.to).toBe(BRIDGEHUB)
    expect(
      base_cost_call.input.startsWith(BASE_COST_SELECTOR),
    ).toBe(true)

    expect(signer_calls.length).toBe(1)
    const signed = signer_calls[0]
    if (!signed) throw new Error("expected one signer call")
    expect(signed.method).toBe("eth_signTransaction")
    expect(signed.tx.to).toBe(BRIDGEHUB)
    const expected_mint_value_u256 = parse(
      Uint256Schema,
      bigint_to_hex(
        BigInt(amount) + BigInt(MOCK_BASE_COST),
      ),
    )
    const expected_mint_value = parse(
      UintSchema,
      expected_mint_value_u256,
    )
    expect(signed.tx.value).toBe(expected_mint_value)
    const l2_chain_id_numeric = parse(
      Uint256Schema,
      bigint_to_hex(BigInt(300)),
    )
    const l2_gas_limit = parse(
      Uint256Schema,
      bigint_to_hex(1_000_000n),
    )
    const pubdata_limit = parse(Uint256Schema, "0x320")
    const empty_bytes = parse(BytesSchema, "0x")
    const expected_calldata = bytes_to_hex(
      encode_function_call({
        name: "requestL2TransactionDirect",
        args: [REQUEST_STRUCT_TUPLE] as const,
        values: [
          {
            chainId: l2_chain_id_numeric,
            mintValue: expected_mint_value_u256,
            l2Contract: RECIPIENT,
            l2Value: amount,
            l2Calldata: empty_bytes,
            l2GasLimit: l2_gas_limit,
            l2GasPerPubdataByteLimit: pubdata_limit,
            factoryDeps: [],
            refundRecipient: RECIPIENT,
          },
        ],
      }),
    )
    expect(signed.tx.input).toBe(expected_calldata)
    expect(
      signed.tx.input.startsWith(REQUEST_SELECTOR),
    ).toBe(true)
    expect(signed.tx._ethernauta.function).toEqual({
      signature: REQUEST_SIGNATURE,
      names: ["_request"],
    })

    expect(raw_send_calls.length).toBe(1)
    const sent = raw_send_calls[0]
    if (!sent) throw new Error("expected one raw send call")
    expect(sent.bytes).toBe(SIGNED_TRANSACTION)
  })

  it("throws when signer is undefined", async () => {
    const reader: Reader = async (
      _call: Call,
    ): Promise<Response> => {
      throw new Error(
        "reader should not be invoked when signer is missing",
      )
    }
    const resolved = build_resolved({ reader })
    await expect(
      send_eth({
        to: RECIPIENT,
        amount: parse(Uint256Schema, "0x38d7ea4c68000"),
      })(resolved),
    ).rejects.toThrow(/requires a signer/)
  })
})
