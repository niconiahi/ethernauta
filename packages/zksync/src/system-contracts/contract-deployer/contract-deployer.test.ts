import { to_selector } from "@ethernauta/abi"
import {
  AddressSchema,
  Bytes32Schema,
  BytesSchema,
} from "@ethernauta/core"
import {
  ChainIdSchema,
  type ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import {
  CONTRACT_DEPLOYER_ADDRESS,
  GET_NEW_ADDRESS_CREATE2_SIGNATURE,
  getNewAddressCreate2,
} from "."

const TEST_CONTEXT: ContractContext = {
  chain_id: parse(ChainIdSchema, "eip155:324"),
  to: CONTRACT_DEPLOYER_ADDRESS,
}

describe("contract-deployer", () => {
  it("should pin the L2 predeploy address", () => {
    expect(CONTRACT_DEPLOYER_ADDRESS).toBe(
      "0x0000000000000000000000000000000000008006",
    )
  })

  it("should encode getNewAddressCreate2 calldata with the right selector", () => {
    const callable = getNewAddressCreate2({
      _sender: parse(
        AddressSchema,
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      ),
      _bytecodeHash: parse(
        Bytes32Schema,
        "0x0100000000000000000000000000000000000000000000000000000000000000",
      ),
      _salt: parse(
        Bytes32Schema,
        "0x0000000000000000000000000000000000000000000000000000000000000001",
      ),
      _input: parse(BytesSchema, "0x"),
    })(TEST_CONTEXT)
    const expected_selector = bytes_to_hex(
      to_selector(
        GET_NEW_ADDRESS_CREATE2_SIGNATURE.signature,
      ),
    )
    expect(callable.data.slice(0, 10)).toBe(
      expected_selector,
    )
  })
})
