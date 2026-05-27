import { describe, expect, it } from "vitest"
import { calculate_base_fee } from "./calculate-base-fee"
import {
  BASE_FEE_MAX_CHANGE_DENOMINATOR,
  ELASTICITY_MULTIPLIER,
} from "./constants"

describe("calculate_base_fee", () => {
  it("returns the parent base fee when parent_gas_used equals the gas target", () => {
    const parent_gas_limit = 30_000_000n
    const parent_gas_target =
      parent_gas_limit / ELASTICITY_MULTIPLIER
    const next = calculate_base_fee({
      parent_gas_used: parent_gas_target,
      parent_gas_limit,
      parent_base_fee_per_gas: 1_000_000_000n,
    })
    expect(next).toBe(1_000_000_000n)
  })

  it("raises the base fee when parent_gas_used is above the target", () => {
    const parent_gas_limit = 30_000_000n
    const parent_gas_target =
      parent_gas_limit / ELASTICITY_MULTIPLIER
    const parent_base = 1_000_000_000n
    const gas_used_delta = parent_gas_target / 2n
    const next = calculate_base_fee({
      parent_gas_used: parent_gas_target + gas_used_delta,
      parent_gas_limit,
      parent_base_fee_per_gas: parent_base,
    })
    const expected_delta =
      (parent_base * gas_used_delta) /
      parent_gas_target /
      BASE_FEE_MAX_CHANGE_DENOMINATOR
    expect(next).toBe(parent_base + expected_delta)
  })

  it("lowers the base fee when parent_gas_used is below the target", () => {
    const parent_gas_limit = 30_000_000n
    const parent_gas_target =
      parent_gas_limit / ELASTICITY_MULTIPLIER
    const parent_base = 1_000_000_000n
    const gas_used_delta = parent_gas_target / 2n
    const next = calculate_base_fee({
      parent_gas_used: parent_gas_target - gas_used_delta,
      parent_gas_limit,
      parent_base_fee_per_gas: parent_base,
    })
    const expected_delta =
      (parent_base * gas_used_delta) /
      parent_gas_target /
      BASE_FEE_MAX_CHANGE_DENOMINATOR
    expect(next).toBe(parent_base - expected_delta)
  })
})
