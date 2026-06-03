import {
  address as address_codec,
  bytes as bytes_codec,
  bytes32 as bytes32_codec,
  encode_function_call,
  encode_sequence,
  function_selector,
  uint256 as uint256_codec,
} from "@ethernauta/abi"
import {
  AddressSchema,
  type Bytes,
  Bytes32Schema,
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
import { keccak_256 } from "@noble/hashes/sha3"
import type { InferOutput } from "valibot"
import {
  array,
  object,
  parse,
  string,
  tuple,
} from "valibot"
import { describe, expect, it } from "vitest"

import { L2_ASSET_ROUTER_ADDRESS } from "./l2-asset-router"
import { start_withdraw_erc20 } from "./start-withdraw-erc20"

const ERA_SEPOLIA = encode_chain_id({
  namespace: "eip155",
  reference: "300",
})
const SEPOLIA = encode_chain_id({
  namespace: "eip155",
  reference: "11155111",
})
const L1_TOKEN = parse(
  AddressSchema,
  "0x2222222222222222222222222222222222222222",
)
const RECIPIENT = parse(
  AddressSchema,
  "0x1111111111111111111111111111111111111111",
)
const L2_NATIVE_TOKEN_VAULT = parse(
  AddressSchema,
  "0x0000000000000000000000000000000000010004",
)
const SIGNED_TRANSACTION = parse(
  BytesSchema,
  "0x02f86c0184deadbeef841dcd6500841dcd6500825208941111111111111111111111111111111111111111880de0b6b3a764000080c001a01111111111111111111111111111111111111111111111111111111111111111a02222222222222222222222222222222222222222222222222222222222222222",
)
const RETURNED_HASH = parse(
  Hash32Schema,
  "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
)

const WITHDRAW_SIGNATURE_TEXT = "withdraw(bytes32,bytes)"
const WITHDRAW_SELECTOR = function_selector("withdraw", [
  bytes32_codec(),
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
          "l1 reader should not be invoked from start_withdraw_erc20",
        )
      },
    },
    l2: {
      chain_id: ERA_SEPOLIA,
      reader,
    },
  }
}

describe("start_withdraw_erc20", () => {
  it("derives assetId = keccak256(abi.encode(L1_CHAIN_ID, L2_NTV, l1_token)), encodes assetData = (amount, to, l1_token), signs L2AssetRouter.withdraw(bytes32,bytes) on L2 with msg.value = 0, and broadcasts", async () => {
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
    const amount = parse(Uint256Schema, "0xde0b6b3a7640000") // 1 token
    const hash = await start_withdraw_erc20({
      l1_token: L1_TOKEN,
      to: RECIPIENT,
      amount,
    })(resolved)
    expect(hash).toBe(RETURNED_HASH)

    expect(signer_calls.length).toBe(1)
    const signed = signer_calls[0]
    if (!signed) throw new Error("expected one signer call")
    expect(signed.method).toBe("eth_signTransaction")
    expect(signed.tx.to).toBe(L2_ASSET_ROUTER_ADDRESS)
    expect(signed.tx.value).toBe(parse(UintSchema, "0x0"))

    // Era Sepolia's L1 is Sepolia (parentChainId = 11155111).
    const l1_chain_id = parse(
      Uint256Schema,
      bigint_to_hex(BigInt(11155111)),
    )
    const expected_asset_id = parse(
      Bytes32Schema,
      bytes_to_hex(
        keccak_256(
          encode_sequence(
            [
              uint256_codec(),
              address_codec(),
              address_codec(),
            ],
            [l1_chain_id, L2_NATIVE_TOKEN_VAULT, L1_TOKEN],
          ),
        ),
      ),
    )
    const expected_asset_data = parse(
      BytesSchema,
      bytes_to_hex(
        encode_sequence(
          [
            uint256_codec(),
            address_codec(),
            address_codec(),
          ],
          [amount, RECIPIENT, L1_TOKEN],
        ),
      ),
    )
    const expected_calldata = bytes_to_hex(
      encode_function_call({
        name: "withdraw",
        args: [bytes32_codec(), bytes_codec()] as const,
        values: [expected_asset_id, expected_asset_data],
      }),
    )
    expect(signed.tx.input).toBe(expected_calldata)
    expect(
      signed.tx.input.startsWith(WITHDRAW_SELECTOR),
    ).toBe(true)
    expect(signed.tx._ethernauta.function).toEqual({
      signature: WITHDRAW_SIGNATURE_TEXT,
      names: ["_assetId", "_assetData"],
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
      start_withdraw_erc20({
        l1_token: L1_TOKEN,
        to: RECIPIENT,
        amount: parse(Uint256Schema, "0xde0b6b3a7640000"),
      })(resolved),
    ).rejects.toThrow(/requires a signer/)
  })
})
