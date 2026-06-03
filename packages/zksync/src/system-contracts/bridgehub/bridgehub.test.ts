import { to_selector } from "@ethernauta/abi"
import { Uint256Schema } from "@ethernauta/core"
import {
  ChainIdSchema,
  type ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import {
  BRIDGEHUB_L2_ADDRESS,
  GET_ZK_CHAIN_SIGNATURE,
  getZKChain,
  L1_CHAIN_ID,
  L1_CHAIN_ID_SIGNATURE,
} from "."

const TEST_CONTEXT: ContractContext = {
  chain_id: parse(ChainIdSchema, "eip155:324"),
  to: BRIDGEHUB_L2_ADDRESS,
}

describe("bridgehub", () => {
  it("should pin the L2 predeploy address", () => {
    expect(BRIDGEHUB_L2_ADDRESS).toBe(
      "0x0000000000000000000000000000000000010002",
    )
  })

  it("should encode L1_CHAIN_ID calldata with the right selector", () => {
    const callable = L1_CHAIN_ID()(TEST_CONTEXT)
    const expected_selector = bytes_to_hex(
      to_selector(L1_CHAIN_ID_SIGNATURE.signature),
    )
    expect(callable.data).toBe(expected_selector)
  })

  it("should encode getZKChain calldata with the right selector", () => {
    const callable = getZKChain([
      parse(Uint256Schema, "0x144"),
    ])(TEST_CONTEXT)
    const expected_selector = bytes_to_hex(
      to_selector(GET_ZK_CHAIN_SIGNATURE.signature),
    )
    expect(callable.data.slice(0, 10)).toBe(
      expected_selector,
    )
  })
})
