import {
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

import { L1_MESSENGER_ADDRESS } from "../system-contracts/l1-messenger"
import { start_withdraw_message } from "./start-withdraw-message"

const ERA_SEPOLIA = encode_chain_id({
  namespace: "eip155",
  reference: "300",
})
const SEPOLIA = encode_chain_id({
  namespace: "eip155",
  reference: "11155111",
})
const MESSAGE = parse(BytesSchema, "0xdeadbeefcafef00d")
const SIGNED_TRANSACTION = parse(
  BytesSchema,
  "0x02f86c0184deadbeef841dcd6500841dcd6500825208941111111111111111111111111111111111111111880de0b6b3a764000080c001a01111111111111111111111111111111111111111111111111111111111111111a02222222222222222222222222222222222222222222222222222222222222222",
)
const RETURNED_HASH = parse(
  Hash32Schema,
  "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
)

const SEND_TO_L1_SIGNATURE_TEXT = "sendToL1(bytes)"
const SEND_TO_L1_SELECTOR = function_selector("sendToL1", [
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
    l1: {
      chain_id: SEPOLIA,
      reader: async (_call: Call): Promise<Response> => {
        throw new Error(
          "l1 reader should not be invoked from start_withdraw_message",
        )
      },
    },
    l2: {
      chain_id: ERA_SEPOLIA,
      reader,
    },
  }
}

describe("start_withdraw_message", () => {
  it("signs L1Messenger.sendToL1 on L2 with msg.value = 0 and broadcasts via eth_sendRawTransaction", async () => {
    const signer_calls: { method: string; tx: Tx }[] = []
    const signer: Signer = async (method, _params) => {
      const [tx] = parse(SignParamsSchema, _params)
      signer_calls.push({ method, tx })
      return SIGNED_TRANSACTION
    }
    const raw_send_calls: { bytes: Bytes }[] = []
    const reader: Reader = async (
      call: Call,
    ): Promise<Response> => {
      const [method, params] = call
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
    const hash = await start_withdraw_message({
      message: MESSAGE,
    })(resolved)
    expect(hash).toBe(RETURNED_HASH)

    expect(signer_calls.length).toBe(1)
    const signed = signer_calls[0]
    if (!signed) throw new Error("expected one signer call")
    expect(signed.method).toBe("eth_signTransaction")
    expect(signed.tx.to).toBe(L1_MESSENGER_ADDRESS)
    expect(signed.tx.value).toBe(parse(UintSchema, "0x0"))

    const expected_calldata = bytes_to_hex(
      encode_function_call({
        name: "sendToL1",
        args: [bytes_codec()] as const,
        values: [MESSAGE],
      }),
    )
    expect(signed.tx.input).toBe(expected_calldata)
    expect(
      signed.tx.input.startsWith(SEND_TO_L1_SELECTOR),
    ).toBe(true)
    expect(signed.tx._ethernauta.function).toEqual({
      signature: SEND_TO_L1_SIGNATURE_TEXT,
      names: ["_message"],
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
      start_withdraw_message({ message: MESSAGE })(
        resolved,
      ),
    ).rejects.toThrow(/requires a signer/)
  })
})
