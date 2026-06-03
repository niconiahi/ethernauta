import {
  address as address_codec,
  bytes as bytes_codec,
  encode_function_call,
  encode_sequence,
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

import { send_erc20 } from "./send-erc20"

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
// Era Sepolia L1AssetRouter — from packages/zksync/src/deploys/eip155-300.ts
const ASSET_ROUTER = parse(
  AddressSchema,
  "0xF2a49545C5B1A85d2fB018cC39103661639a9B06",
)
const L1_TOKEN = parse(
  AddressSchema,
  "0x2222222222222222222222222222222222222222",
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
const MOCK_GAS_PRICE = parse(UintSchema, "0x3b9aca00")
const MOCK_BASE_COST = parse(
  Uint256Schema,
  "0x5af3107a4000",
)

const REQUEST_STRUCT_TUPLE = tuple_codec({
  chainId: uint256_codec(),
  mintValue: uint256_codec(),
  l2Value: uint256_codec(),
  l2GasLimit: uint256_codec(),
  l2GasPerPubdataByteLimit: uint256_codec(),
  refundRecipient: address_codec(),
  secondBridgeAddress: address_codec(),
  secondBridgeValue: uint256_codec(),
  secondBridgeCalldata: bytes_codec(),
})
const REQUEST_SIGNATURE =
  "requestL2TransactionTwoBridges((uint256,uint256,uint256,uint256,uint256,address,address,uint256,bytes))"
const REQUEST_SELECTOR = function_selector(
  "requestL2TransactionTwoBridges",
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
          "l2 reader should not be invoked from send_erc20",
        )
      },
    },
  }
}

describe("send_erc20", () => {
  it("reads Bridgehub.l2TransactionBaseCost, signs requestL2TransactionTwoBridges with the encoded asset-router payload + msg.value = mintValue, and broadcasts via eth_sendRawTransaction", async () => {
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
    const amount = parse(Uint256Schema, "0xde0b6b3a7640000") // 1 token (18 dec)
    const hash = await send_erc20({
      l1_token: L1_TOKEN,
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
    const expected_mint_value_u256 = MOCK_BASE_COST
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
    const zero_u256 = parse(Uint256Schema, "0x0")
    // The locked secondBridgeCalldata shape — asserting equality
    // here proves both the inner payload (l1_token, amount, to)
    // and that send_erc20 wires the L1AssetRouter as the
    // second-bridge target.
    const expected_inner = parse(
      BytesSchema,
      bytes_to_hex(
        encode_sequence(
          [
            address_codec(),
            uint256_codec(),
            address_codec(),
          ],
          [L1_TOKEN, amount, RECIPIENT],
        ),
      ),
    )
    const expected_calldata = bytes_to_hex(
      encode_function_call({
        name: "requestL2TransactionTwoBridges",
        args: [REQUEST_STRUCT_TUPLE] as const,
        values: [
          {
            chainId: l2_chain_id_numeric,
            mintValue: expected_mint_value_u256,
            l2Value: zero_u256,
            l2GasLimit: l2_gas_limit,
            l2GasPerPubdataByteLimit: pubdata_limit,
            refundRecipient: RECIPIENT,
            secondBridgeAddress: ASSET_ROUTER,
            secondBridgeValue: zero_u256,
            secondBridgeCalldata: expected_inner,
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
      send_erc20({
        l1_token: L1_TOKEN,
        to: RECIPIENT,
        amount: parse(Uint256Schema, "0xde0b6b3a7640000"),
      })(resolved),
    ).rejects.toThrow(/requires a signer/)
  })
})
