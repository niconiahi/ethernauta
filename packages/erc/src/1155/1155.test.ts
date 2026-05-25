import {
  array,
  encode_function_call,
  uint256,
} from "@ethernauta/abi"
import {
  addressSchema,
  bytesSchema,
  uint256Schema,
} from "@ethernauta/core"
import { bytes_to_hex } from "@ethernauta/utils"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import {
  BALANCE_OF_BATCH_SIGNATURE,
  balanceOfBatch,
} from "./methods"

const ACCOUNT_1 = parse(
  addressSchema,
  "0x1111111111111111111111111111111111111111",
)
const ACCOUNT_2 = parse(
  addressSchema,
  "0x2222222222222222222222222222222222222222",
)
const CONTRACT = parse(
  addressSchema,
  "0x3333333333333333333333333333333333333333",
)
const ID_1 = parse(uint256Schema, "0x1")
const ID_2 = parse(uint256Schema, "0x2")

describe("ERC-1155 balanceOfBatch — generated binding", () => {
  it("exposes the canonical signature with [] suffixes preserved", () => {
    expect(BALANCE_OF_BATCH_SIGNATURE.signature).toBe(
      "balanceOfBatch(address[],uint256[])",
    )
    expect(BALANCE_OF_BATCH_SIGNATURE.names).toEqual([
      "accounts",
      "ids",
    ])
  })

  it("encodes calldata starting with the canonical 4-byte selector 0x4e1273f4", () => {
    // Selector from the ERC-1155 spec: keccak256("balanceOfBatch(address[],uint256[])")[0..4]
    const call = balanceOfBatch({
      accounts: [ACCOUNT_1, ACCOUNT_2],
      ids: [ID_1, ID_2],
    })({
      chain_id: "eip155:1",
      to: CONTRACT,
    })
    expect(call.data.slice(0, 10)).toBe("0x4e1273f4")
  })

  it("accepts positional input shape equivalently to object shape", () => {
    const ctx = {
      chain_id: "eip155:1",
      to: CONTRACT,
    } as const
    const accounts = [ACCOUNT_1, ACCOUNT_2] as const
    const ids = [ID_1, ID_2] as const

    const by_object = balanceOfBatch({
      accounts: [...accounts],
      ids: [...ids],
    })(ctx)
    const by_tuple = balanceOfBatch([
      [...accounts],
      [...ids],
    ])(ctx)

    expect(by_object.data).toBe(by_tuple.data)
  })

  it("decode() round-trips an ABI-encoded uint256[] response", () => {
    const call = balanceOfBatch({
      accounts: [ACCOUNT_1],
      ids: [ID_1],
    })({
      chain_id: "eip155:1",
      to: CONTRACT,
    })

    // Build a synthetic response: ABI-encoded (uint256[]) with values [10, 20, 30].
    // uint256Schema preserves the full 32-byte padding on decode (so 10 -> 0x000...000a).
    const input_values = [
      parse(uint256Schema, "0xa"),
      parse(uint256Schema, "0x14"),
      parse(uint256Schema, "0x1e"),
    ] as const
    const response_bytes = encode_function_call({
      name: "_synthetic",
      args: [array(uint256())] as const,
      values: [[...input_values]] as const,
    })
    // The Callable's decode takes the hex string for the response body
    // (without the 4-byte synthetic selector that encode_function_call prepends).
    const response_body_hex = parse(
      bytesSchema,
      bytes_to_hex(response_bytes.slice(4)),
    )

    const decoded = call.decode(response_body_hex)
    expect(decoded).toEqual([
      "0x000000000000000000000000000000000000000000000000000000000000000a",
      "0x0000000000000000000000000000000000000000000000000000000000000014",
      "0x000000000000000000000000000000000000000000000000000000000000001e",
    ])
  })
})
