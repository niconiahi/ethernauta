import {
  address as address_codec,
  bytes as bytes_codec,
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
import type { InferOutput } from "valibot"
import {
  array,
  object,
  parse,
  string,
  tuple,
} from "valibot"
import { describe, expect, it } from "vitest"

import { execute_withdraw } from "./execute-withdraw"

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
const SIGNED_TRANSACTION = parse(
  BytesSchema,
  "0x02f86c0184deadbeef841dcd6500841dcd6500825208941111111111111111111111111111111111111111880de0b6b3a764000080c001a01111111111111111111111111111111111111111111111111111111111111111a02222222222222222222222222222222222222222222222222222222222222222",
)
const RETURNED_HASH = parse(
  Hash32Schema,
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
)
const SENDER = parse(
  AddressSchema,
  "0x1111111111111111111111111111111111111111",
)
const TARGET = parse(
  AddressSchema,
  "0x2222222222222222222222222222222222222222",
)
const WITHDRAWAL_TRANSACTION = {
  nonce: parse(Uint256Schema, "0x01"),
  sender: SENDER,
  target: TARGET,
  value: parse(Uint256Schema, "0x0de0b6b3a7640000"),
  gasLimit: parse(Uint256Schema, "0x030d40"),
  data: parse(BytesSchema, "0xdeadbeef"),
}

const FINALIZE_WITHDRAWAL_SELECTOR = function_selector(
  "finalizeWithdrawalTransaction",
  [
    tuple_codec({
      nonce: uint256_codec(),
      sender: address_codec(),
      target: address_codec(),
      value: uint256_codec(),
      gasLimit: uint256_codec(),
      data: bytes_codec(),
    }),
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
      chain_id: OP_SEPOLIA,
      reader: async (_call: Call): Promise<Response> => {
        throw new Error(
          "l2 reader should not be invoked from execute_withdraw",
        )
      },
    },
    l1: {
      chain_id: SEPOLIA,
      reader,
    },
  }
}

describe("execute_withdraw", () => {
  it("signs finalizeWithdrawalTransaction against the L1 portal, broadcasts on L1, returns the tx hash", async () => {
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
    const hash = await execute_withdraw({
      message: WITHDRAWAL_TRANSACTION,
    })(resolved)
    expect(hash).toBe(RETURNED_HASH)
    expect(signer_calls.length).toBe(1)
    const signed = signer_calls[0]
    if (!signed) throw new Error("expected one signer call")
    expect(signed.method).toBe("eth_signTransaction")
    expect(signed.tx.to).toBe(OPTIMISM_PORTAL_PROXY)
    expect(signed.tx.value).toBe(parse(UintSchema, "0x0"))
    expect(
      signed.tx.input.startsWith(
        FINALIZE_WITHDRAWAL_SELECTOR,
      ),
    ).toBe(true)
    expect(signed.tx._ethernauta.function.signature).toBe(
      "finalizeWithdrawalTransaction((uint256,address,address,uint256,uint256,bytes))",
    )
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
      execute_withdraw({
        message: WITHDRAWAL_TRANSACTION,
      })(resolved),
    ).rejects.toThrow(/requires a signer/)
  })
})
