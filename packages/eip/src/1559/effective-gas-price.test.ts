import { describe, expect, it } from "vitest"
import { effective_gas_price } from "./effective-gas-price"

describe("effective_gas_price", () => {
  it("caps the priority fee at max_fee_per_gas - base_fee_per_gas", () => {
    const price = effective_gas_price({
      max_priority_fee_per_gas: 10_000_000_000n,
      max_fee_per_gas: 12_000_000_000n,
      base_fee_per_gas: 10_000_000_000n,
    })
    expect(price).toBe(12_000_000_000n)
  })

  it("uses the full priority fee when it fits under the cap", () => {
    const price = effective_gas_price({
      max_priority_fee_per_gas: 1_000_000_000n,
      max_fee_per_gas: 12_000_000_000n,
      base_fee_per_gas: 10_000_000_000n,
    })
    expect(price).toBe(11_000_000_000n)
  })

  it("returns the base fee when max_fee_per_gas equals base_fee_per_gas", () => {
    const price = effective_gas_price({
      max_priority_fee_per_gas: 5_000_000_000n,
      max_fee_per_gas: 10_000_000_000n,
      base_fee_per_gas: 10_000_000_000n,
    })
    expect(price).toBe(10_000_000_000n)
  })
})
