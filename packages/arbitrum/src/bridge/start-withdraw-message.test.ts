import {
  address as address_codec,
  bytes as bytes_codec,
  encode_function_call,
  function_selector,
} from "@ethernauta/abi"
import {
  AddressSchema,
  type Bytes,
  BytesSchema,
  Hash32Schema,
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

import { start_withdraw_message } from "./start-withdraw-message"

const ARB_SEPOLIA = encode_chain_id({
  namespace: "eip155",
  reference: "421614",
})
const SEPOLIA = encode_chain_id({
  namespace: "eip155",
  reference: "11155111",
})
const ARB_SYS = parse(
  AddressSchema,
  "0x0000000000000000000000000000000000000064",
)
const RECIPIENT = parse(
  AddressSchema,
  "0x2222222222222222222222222222222222222222",
)
const PAYLOAD = parse(BytesSchema, "0xcafebabe")
const SIGNED_TRANSACTION = parse(
  BytesSchema,
  "0x02f86c0184deadbeef841dcd6500841dcd6500825208941111111111111111111111111111111111111111880de0b6b3a764000080c001a01111111111111111111111111111111111111111111111111111111111111111a02222222222222222222222222222222222222222222222222222222222222222",
)
const RETURNED_HASH = parse(
  Hash32Schema,
  "0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
)
const SELECTOR = function_selector("sendTxToL1", [
  address_codec(),
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
  reader: Reader
}): ResolvedBridge {
  return {
    signer,
    l2: {
      chain_id: ARB_SEPOLIA,
      reader,
    },
    l1: {
      chain_id: SEPOLIA,
      reader: async (_call: Call): Promise<Response> => {
        throw new Error(
          "l1 reader should not be invoked from start_withdraw_message",
        )
      },
    },
  }
}

describe("start_withdraw_message", () => {
  it("signs ArbSys.sendTxToL1 on L2 with msg.value = value and broadcasts via eth_sendRawTransaction", async () => {
    const signer_calls: { method: string; tx: Tx }[] = []
    const signer: Signer = async (method, _params) => {
      const [tx] = parse(SignParamsSchema, _params)
      signer_calls.push({ method, tx })
      return SIGNED_TRANSACTION
    }
    const reader_calls: { method: string; bytes: Bytes }[] =
      []
    const reader: Reader = async (
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
    const value = parse(UintSchema, "0x16345785d8a0000")
    const hash = await start_withdraw_message({
      to: RECIPIENT,
      value,
      data: PAYLOAD,
    })(resolved)
    expect(hash).toBe(RETURNED_HASH)
    expect(signer_calls.length).toBe(1)
    const signed = signer_calls[0]
    if (!signed) throw new Error("expected one signer call")
    expect(signed.method).toBe("eth_signTransaction")
    expect(signed.tx.to).toBe(ARB_SYS)
    expect(signed.tx.value).toBe(value)
    const expected_calldata = bytes_to_hex(
      encode_function_call({
        name: "sendTxToL1",
        args: [address_codec(), bytes_codec()] as const,
        values: [RECIPIENT, PAYLOAD] as const,
      }),
    )
    expect(signed.tx.input).toBe(expected_calldata)
    expect(signed.tx.input.startsWith(SELECTOR)).toBe(true)
    expect(signed.tx._ethernauta.function).toEqual({
      signature: "sendTxToL1(address,bytes)",
      names: ["destination", "data"],
    })
    expect(reader_calls.length).toBe(1)
    const sent = reader_calls[0]
    if (!sent) throw new Error("expected one reader call")
    expect(sent.method).toBe("eth_sendRawTransaction")
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
      start_withdraw_message({
        to: RECIPIENT,
        value: parse(UintSchema, "0x0"),
        data: PAYLOAD,
      })(resolved),
    ).rejects.toThrow(/requires a signer/)
  })
})
