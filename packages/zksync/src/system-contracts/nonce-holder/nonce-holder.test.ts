import { to_selector } from "@ethernauta/abi"
import { AddressSchema } from "@ethernauta/core"
import {
  ChainIdSchema,
  type ContractContext,
} from "@ethernauta/transport"
import {
  bytes_to_hex,
  hex_to_bytes,
} from "@ethernauta/utils"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import {
  GET_MIN_NONCE_SIGNATURE,
  getMinNonce,
  NONCE_HOLDER_ADDRESS,
} from "."

const TEST_CONTEXT: ContractContext = {
  chain_id: parse(ChainIdSchema, "eip155:324"),
  to: NONCE_HOLDER_ADDRESS,
}

describe("nonce-holder", () => {
  it("should pin the L2 predeploy address", () => {
    expect(NONCE_HOLDER_ADDRESS).toBe(
      "0x0000000000000000000000000000000000008003",
    )
  })

  it("should encode getMinNonce calldata with the right selector", () => {
    const callable = getMinNonce([
      parse(
        AddressSchema,
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      ),
    ])(TEST_CONTEXT)
    const expected_selector = bytes_to_hex(
      to_selector(GET_MIN_NONCE_SIGNATURE.signature),
    )
    expect(callable.data.slice(0, 10)).toBe(
      expected_selector,
    )
    expect(hex_to_bytes(callable.data).length).toBe(36)
  })
})
