import {
  address as address_codec,
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

import { L2_BASE_TOKEN_ADDRESS } from "./l2-base-token"
import { start_withdraw_eth } from "./start-withdraw-eth"

const ERA_SEPOLIA = encode_chain_id({
  namespace: "eip155",
  reference: "300",
})
const SEPOLIA = encode_chain_id({
  namespace: "eip155",
  reference: "11155111",
})
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

const WITHDRAW_SIGNATURE_TEXT = "withdraw(address)"
const WITHDRAW_SELECTOR = function_selector("withdraw", [
  address_codec(),
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
          "l1 reader should not be invoked from start_withdraw_eth",
        )
      },
    },
    l2: {
      chain_id: ERA_SEPOLIA,
      reader,
    },
  }
}

describe("start_withdraw_eth", () => {
  it("signs L2BaseToken.withdraw on L2 with msg.value = amount and broadcasts via eth_sendRawTransaction", async () => {
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
    const amount = parse(UintSchema, "0x38d7ea4c68000") // 0.001 ETH
    const hash = await start_withdraw_eth({
      to: RECIPIENT,
      amount,
    })(resolved)
    expect(hash).toBe(RETURNED_HASH)

    expect(signer_calls.length).toBe(1)
    const signed = signer_calls[0]
    if (!signed) throw new Error("expected one signer call")
    expect(signed.method).toBe("eth_signTransaction")
    expect(signed.tx.to).toBe(L2_BASE_TOKEN_ADDRESS)
    expect(signed.tx.value).toBe(amount)

    const expected_calldata = bytes_to_hex(
      encode_function_call({
        name: "withdraw",
        args: [address_codec()] as const,
        values: [RECIPIENT],
      }),
    )
    expect(signed.tx.input).toBe(expected_calldata)
    expect(
      signed.tx.input.startsWith(WITHDRAW_SELECTOR),
    ).toBe(true)
    expect(signed.tx._ethernauta.function).toEqual({
      signature: WITHDRAW_SIGNATURE_TEXT,
      names: ["_l1Receiver"],
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
      start_withdraw_eth({
        to: RECIPIENT,
        amount: parse(UintSchema, "0x38d7ea4c68000"),
      })(resolved),
    ).rejects.toThrow(/requires a signer/)
  })
})
