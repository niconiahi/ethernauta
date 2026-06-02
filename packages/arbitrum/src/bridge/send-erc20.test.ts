import {
  address as address_codec,
  bytes as bytes_codec,
  encode_function_call,
  encode_sequence,
  function_selector,
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

const ARB_SEPOLIA = encode_chain_id({
  namespace: "eip155",
  reference: "421614",
})
const SEPOLIA = encode_chain_id({
  namespace: "eip155",
  reference: "11155111",
})
// Arb Sepolia L1GatewayRouter — from
// packages/arbitrum/src/deploys/eip155-421614.ts
const L1_GATEWAY_ROUTER = parse(
  AddressSchema,
  "0xcE18836b233C83325Cc8848CA4487e94C6288264",
)
const L1_TOKEN = parse(
  AddressSchema,
  "0x2222222222222222222222222222222222222222",
)
const RECIPIENT = parse(
  AddressSchema,
  "0x1111111111111111111111111111111111111111",
)
// Mock gateway returned by `getGateway(l1_token)` —
// arbitrary non-zero value.
const RESOLVED_GATEWAY = parse(
  AddressSchema,
  "0x4444444444444444444444444444444444444444",
)
const SIGNED_TRANSACTION = parse(
  BytesSchema,
  "0x02f86c0184deadbeef841dcd6500841dcd6500825208941111111111111111111111111111111111111111880de0b6b3a764000080c001a01111111111111111111111111111111111111111111111111111111111111111a02222222222222222222222222222222222222222222222222222222222222222",
)
const RETURNED_HASH = parse(
  Hash32Schema,
  "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
)
const SELECTOR = function_selector("outboundTransfer", [
  address_codec(),
  address_codec(),
  uint256_codec(),
  uint256_codec(),
  uint256_codec(),
  bytes_codec(),
])
const GET_GATEWAY_SELECTOR = function_selector(
  "getGateway",
  [address_codec()],
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

function pad32_address(address: string): string {
  const without_prefix = address.toLowerCase().slice(2)
  return `0x${without_prefix.padStart(64, "0")}`
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
      chain_id: ARB_SEPOLIA,
      reader: async (_call: Call): Promise<Response> => {
        throw new Error(
          "l2 reader should not be invoked from send_erc20",
        )
      },
    },
  }
}

describe("send_erc20", () => {
  it("reads L1GatewayRouter.getGateway, signs outboundTransfer with the encoded data + computed msg.value, and broadcasts via eth_sendRawTransaction", async () => {
    const signer_calls: { method: string; tx: Tx }[] = []
    const signer: Signer = async (method, _params) => {
      const [tx] = parse(SignParamsSchema, _params)
      signer_calls.push({ method, tx })
      return SIGNED_TRANSACTION
    }
    const eth_call_calls: {
      to: string
      input: Bytes
    }[] = []
    const raw_send_calls: { bytes: Bytes }[] = []
    const reader: Reader = async (
      call: Call,
    ): Promise<Response> => {
      const [method, params] = call
      if (method === "eth_call") {
        const [tx] = parse(EthCallParamsSchema, params)
        eth_call_calls.push({ to: tx.to, input: tx.input })
        return {
          jsonrpc: "2.0",
          id: "1",
          result: pad32_address(RESOLVED_GATEWAY),
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
    const amount = parse(Uint256Schema, "0xde0b6b3a7640000")
    const max_gas = parse(Uint256Schema, "0x186a0") // 100_000
    const gas_price_bid = parse(
      Uint256Schema,
      "0x3b9aca00", // 1 gwei
    )
    const max_submission_cost = parse(
      Uint256Schema,
      "0x2386f26fc10000", // 0.01 ETH
    )
    const hash = await send_erc20({
      l1_token: L1_TOKEN,
      to: RECIPIENT,
      amount,
      max_gas,
      gas_price_bid,
      max_submission_cost,
    })(resolved)
    expect(hash).toBe(RETURNED_HASH)

    expect(eth_call_calls.length).toBe(1)
    const get_gateway_call = eth_call_calls[0]
    if (!get_gateway_call)
      throw new Error("expected one eth_call")
    expect(get_gateway_call.to).toBe(L1_GATEWAY_ROUTER)
    const expected_get_gateway_calldata = bytes_to_hex(
      encode_function_call({
        name: "getGateway",
        args: [address_codec()] as const,
        values: [L1_TOKEN] as const,
      }),
    )
    expect(get_gateway_call.input).toBe(
      expected_get_gateway_calldata,
    )
    expect(
      get_gateway_call.input.startsWith(
        GET_GATEWAY_SELECTOR,
      ),
    ).toBe(true)

    expect(signer_calls.length).toBe(1)
    const signed = signer_calls[0]
    if (!signed) throw new Error("expected one signer call")
    expect(signed.method).toBe("eth_signTransaction")
    expect(signed.tx.to).toBe(L1_GATEWAY_ROUTER)
    const expected_value = parse(
      UintSchema,
      bigint_to_hex(
        BigInt(max_submission_cost) +
          BigInt(max_gas) * BigInt(gas_price_bid),
      ),
    )
    expect(signed.tx.value).toBe(expected_value)
    const empty_bytes = parse(BytesSchema, "0x")
    const expected_data = parse(
      BytesSchema,
      bytes_to_hex(
        encode_sequence(
          [uint256_codec(), bytes_codec()],
          [max_submission_cost, empty_bytes],
        ),
      ),
    )
    const expected_calldata = bytes_to_hex(
      encode_function_call({
        name: "outboundTransfer",
        args: [
          address_codec(),
          address_codec(),
          uint256_codec(),
          uint256_codec(),
          uint256_codec(),
          bytes_codec(),
        ] as const,
        values: [
          L1_TOKEN,
          RECIPIENT,
          amount,
          max_gas,
          gas_price_bid,
          expected_data,
        ],
      }),
    )
    expect(signed.tx.input).toBe(expected_calldata)
    expect(signed.tx.input.startsWith(SELECTOR)).toBe(true)
    expect(signed.tx._ethernauta.function).toEqual({
      signature:
        "outboundTransfer(address,address,uint256,uint256,uint256,bytes)",
      names: [
        "_token",
        "_to",
        "_amount",
        "_maxGas",
        "_gasPriceBid",
        "_data",
      ],
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
        max_gas: parse(Uint256Schema, "0x186a0"),
        gas_price_bid: parse(Uint256Schema, "0x3b9aca00"),
        max_submission_cost: parse(
          Uint256Schema,
          "0x2386f26fc10000",
        ),
      })(resolved),
    ).rejects.toThrow(/requires a signer/)
  })
})
