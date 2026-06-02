import {
  address as address_codec,
  bool as bool_codec,
  bytes as bytes_codec,
  encode_function_call,
  function_selector,
  uint64 as uint64_codec,
  uint256 as uint256_codec,
} from "@ethernauta/abi"
import {
  AddressSchema,
  type Bytes,
  BytesSchema,
  Hash32Schema,
  Uint64Schema,
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
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import {
  array,
  boolean,
  object,
  parse,
  string,
  tuple,
} from "valibot"
import { describe, expect, it } from "vitest"

import { send_message } from "./send-message"

const OP_SEPOLIA = encode_chain_id({
  namespace: "eip155",
  reference: "11155420",
})
const SEPOLIA = encode_chain_id({
  namespace: "eip155",
  reference: "11155111",
})
const OPTIMISM_PORTAL_PROXY = parse(
  AddressSchema,
  "0x16Fc5058F25648194471939df75CF27A2fdC48BC",
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
const SELECTOR = function_selector("depositTransaction", [
  address_codec(),
  uint256_codec(),
  uint64_codec(),
  bool_codec(),
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
const CalldataParamsSchema = object({
  to: AddressSchema,
  value: Uint256Schema,
  gas_limit: Uint64Schema,
  is_creation: boolean(),
  data: BytesSchema,
})

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
      chain_id: OP_SEPOLIA,
      reader: async (_call: Call): Promise<Response> => {
        throw new Error(
          "l2 reader should not be invoked from send_message",
        )
      },
    },
  }
}

describe("send_message", () => {
  it("signs eth_signTransaction with depositTransaction calldata and value as msg.value, then broadcasts via eth_sendRawTransaction and returns the L1 tx hash", async () => {
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
    const parameters = parse(CalldataParamsSchema, {
      to: RECIPIENT,
      value: "0xde0b6b3a7640000",
      gas_limit: "0x30d40",
      is_creation: false,
      data: "0xdeadbeef",
    })
    const hash = await send_message(parameters)(resolved)
    expect(hash).toBe(RETURNED_HASH)
    expect(signer_calls.length).toBe(1)
    const signed = signer_calls[0]
    if (!signed) throw new Error("expected one signer call")
    expect(signed.method).toBe("eth_signTransaction")
    expect(signed.tx.to).toBe(OPTIMISM_PORTAL_PROXY)
    expect(signed.tx.value).toBe(parameters.value)
    const expected_calldata = bytes_to_hex(
      encode_function_call({
        name: "depositTransaction",
        args: [
          address_codec(),
          uint256_codec(),
          uint64_codec(),
          bool_codec(),
          bytes_codec(),
        ] as const,
        values: [
          parameters.to,
          parameters.value,
          parameters.gas_limit,
          parameters.is_creation,
          parameters.data,
        ],
      }),
    )
    expect(signed.tx.input).toBe(expected_calldata)
    expect(signed.tx.input.startsWith(SELECTOR)).toBe(true)
    expect(signed.tx._ethernauta.function).toEqual({
      signature:
        "depositTransaction(address,uint256,uint64,bool,bytes)",
      names: [
        "_to",
        "_value",
        "_gasLimit",
        "_isCreation",
        "_data",
      ],
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
      send_message({
        to: RECIPIENT,
        value: parse(Uint256Schema, "0x0"),
        gas_limit: parse(Uint64Schema, "0x30d40"),
        is_creation: false,
        data: parse(BytesSchema, "0x"),
      })(resolved),
    ).rejects.toThrow(/requires a signer/)
  })
})
