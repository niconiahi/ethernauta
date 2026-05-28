import { afterAll, beforeAll } from "vitest"

import {
  is_isolation_disabled,
  set_isolation_disabled,
} from "./isolation-state"

// Per-describe opt-out for the plugin's default-on snapshot /
// revert isolation. Call this at the top of a `describe` block
// that deliberately wants to accumulate state across its tests
// (deploy a contract once, run a battery of reads against it).
//
//   describe("contract reads", () => {
//     without_isolation()
//
//     beforeAll(deploy_contract)
//     it("balanceOf alice", ...)
//     it("balanceOf bob", ...)   // sees the same deployed contract
//   })
//
// Restores the previous value on `afterAll` so nesting works:
// an inner `without_isolation()` does not permanently disable
// isolation for the outer scope.

export function without_isolation(): void {
  let previous = false
  beforeAll(() => {
    previous = is_isolation_disabled()
    set_isolation_disabled(true)
  })
  afterAll(() => {
    set_isolation_disabled(previous)
  })
}
