import { AddressSchema } from "@ethernauta/core"
import { create_testing_reader } from "@ethernauta/testing"
import { encode_chain_id } from "@ethernauta/transport"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { stub_http } from "../../test-helpers"

import { calculate_gas_zksync } from "./calculate-gas-zksync"

const CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: "324",
})
const testing_reader = create_testing_reader({
  chain_id: CHAIN_ID,
})

describe("calculate_gas_zksync", () => {
  it("re-tags the zks_estimateFee response with kind: zksync", async () => {
    const result_payload = {
      gas_limit: "0x22f28",
      gas_per_pubdata_limit: "0x16",
      max_fee_per_gas: "0x2b275d0",
      max_priority_fee_per_gas: "0x0",
    }
    const resolved = testing_reader(
      stub_http(result_payload),
    )
    const fees = await calculate_gas_zksync({
      tx: {
        to: parse(
          AddressSchema,
          "0x0000000000000000000000000000000000000001",
        ),
      },
    })(resolved)
    expect(fees.kind).toBe("zksync")
    expect(fees.gas_limit).toBe("0x22f28")
    expect(fees.gas_per_pubdata_limit).toBe("0x16")
    expect(fees.max_fee_per_gas).toBe("0x2b275d0")
    expect(fees.max_priority_fee_per_gas).toBe("0x0")
  })
})
