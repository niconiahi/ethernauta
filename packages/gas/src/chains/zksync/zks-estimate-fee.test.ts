import { AddressSchema } from "@ethernauta/core"
import { create_testing_reader } from "@ethernauta/testing"
import { encode_chain_id } from "@ethernauta/transport"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { stub_http } from "../../test-helpers"

import { zks_estimate_fee } from "./zks-estimate-fee"

// zkSync Era mainnet CAIP-2.
const CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: "324",
})
const testing_reader = create_testing_reader({
  chain_id: CHAIN_ID,
})

describe("zks_estimate_fee", () => {
  it("parses the four-field zks_estimateFee response", async () => {
    // Captured from mainnet smoke test against vitalik.eth.
    const result_payload = {
      gas_limit: "0x22f28",
      gas_per_pubdata_limit: "0x16",
      max_fee_per_gas: "0x2b275d0",
      max_priority_fee_per_gas: "0x0",
    }
    const resolved = testing_reader(
      stub_http(result_payload),
    )
    const fee = await zks_estimate_fee({
      from: parse(
        AddressSchema,
        "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
      ),
      to: parse(
        AddressSchema,
        "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
      ),
    })(resolved)
    expect(fee.gas_limit).toBe("0x22f28")
    expect(fee.gas_per_pubdata_limit).toBe("0x16")
    expect(fee.max_fee_per_gas).toBe("0x2b275d0")
    expect(fee.max_priority_fee_per_gas).toBe("0x0")
  })
})
