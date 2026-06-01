import {
  address as address_codec,
  bytes as bytes_codec,
  encode_function_call,
  function_selector,
  uint32 as uint32_codec,
} from "@ethernauta/abi"
import {
  AddressSchema,
  type Bytes,
  BytesSchema,
  Hash32Schema,
  Uint32Schema,
  UintSchema,
} from "@ethernauta/core"
import type {
  Call,
  Dispatcher,
  ResolvedBridge,
  Response,
  Signer,
} from "@ethernauta/transport"
import { encode_chain_id } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
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

const OP_SEPOLIA = encode_chain_id({
  namespace: "eip155",
  reference: "11155420",
})
const SEPOLIA = encode_chain_id({
  namespace: "eip155",
  reference: "11155111",
})
const L1_STANDARD_BRIDGE_PROXY = parse(
  AddressSchema,
  "0xFBb0621E0B23b5478B630BD55a5f21f67730B0F1",
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
const SELECTOR = function_selector("bridgeETHTo", [
  address_codec(),
  uint32_codec(),
  bytes_codec(),
])

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

function build_resolved({
  signer,
  reader,
}: {
  signer?: Signer
  reader: Dispatcher
}): ResolvedBridge {
  return {
    origin: {
      chain_id: SEPOLIA,
      reader,
      signer,
    },
    destination: {
      chain_id: OP_SEPOLIA,
      reader: async (_call: Call): Promise<Response> => {
        throw new Error(
          "destination reader should not be invoked from send_eth",
        )
      },
    },
  }
}

describe("send_eth", () => {
  it("signs eth_signTransaction with bridgeETHTo calldata, then broadcasts via eth_sendRawTransaction and returns the L1 tx hash", async () => {
    const signer_calls: { method: string; tx: Tx }[] = []
    const signer: Signer = async (method, _params) => {
      const [tx] = parse(SignParamsSchema, _params)
      signer_calls.push({ method, tx })
      return SIGNED_TRANSACTION
    }
    const reader_calls: { method: string; bytes: Bytes }[] =
      []
    const reader: Dispatcher = async (
      call: Call,
    ): Promise<Response> => {
      const [method, params] = call
      const [bytes] = parse(RawSendParamsSchema, params)
      reader_calls.push({ method, bytes })
      return {
        jsonrpc: "2.0",
        id: "1",
        result: RETURNED_HASH,
      }
    }
    const resolved = build_resolved({ signer, reader })
    const amount = parse(UintSchema, "0x38d7ea4c68000")
    const min_gas_limit = parse(Uint32Schema, "0x30d40")
    const hash = await send_eth({
      to: RECIPIENT,
      amount,
      min_gas_limit,
    })(resolved)
    expect(hash).toBe(RETURNED_HASH)
    expect(signer_calls.length).toBe(1)
    const signed = signer_calls[0]
    if (!signed) throw new Error("expected one signer call")
    expect(signed.method).toBe("eth_signTransaction")
    expect(signed.tx.to).toBe(L1_STANDARD_BRIDGE_PROXY)
    expect(signed.tx.value).toBe(amount)
    const empty_bytes = parse(BytesSchema, "0x")
    const expected_calldata = bytes_to_hex(
      encode_function_call({
        name: "bridgeETHTo",
        args: [
          address_codec(),
          uint32_codec(),
          bytes_codec(),
        ] as const,
        values: [RECIPIENT, min_gas_limit, empty_bytes],
      }),
    )
    expect(signed.tx.input).toBe(expected_calldata)
    expect(signed.tx.input.startsWith(SELECTOR)).toBe(true)
    expect(signed.tx._ethernauta.function).toEqual({
      signature: "bridgeETHTo(address,uint32,bytes)",
      names: ["_to", "_minGasLimit", "_extraData"],
    })
    expect(reader_calls.length).toBe(1)
    const sent = reader_calls[0]
    if (!sent) throw new Error("expected one reader call")
    expect(sent.method).toBe("eth_sendRawTransaction")
    expect(sent.bytes).toBe(SIGNED_TRANSACTION)
  })

  it("throws when origin.signer is undefined", async () => {
    const reader: Dispatcher = async (
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
        amount: parse(UintSchema, "0x38d7ea4c68000"),
        min_gas_limit: parse(Uint32Schema, "0x30d40"),
      })(resolved),
    ).rejects.toThrow(/requires a signer/)
  })
})
