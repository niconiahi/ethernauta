import {
  is_isolation_disabled,
  set_isolation_disabled,
} from "./isolation-state"

// Per-describe opt-out for the plugin's default-on snapshot /
// revert isolation. Call this at the top of a `describe` block
// that deliberately wants to accumulate state across its tests
// (deploy a contract once, run a battery of reads against it).
//
//   describe("contract reads", async () => {
//     await without_isolation()
//
//     beforeAll(deploy_contract)
//     it("balanceOf alice", ...)
//     it("balanceOf bob", ...)   // sees the same deployed contract
//   })
//
// `vitest` is imported lazily — a top-level `import "vitest"`
// anywhere in `@ethernauta/testing`'s root barrel would trip
// vitest's "no vitest inside config" guard the moment
// `vitest.config.ts` does `import { ethernauta_anvil } from
// "@ethernauta/testing"`. Resolving it inside the function body
// keeps the barrel side-effect-clean for config-load contexts.
//
// Restores the previous value on `afterAll` so nesting works:
// an inner `without_isolation()` does not permanently disable
// isolation for the outer scope.

export async function without_isolation(): Promise<void> {
  const { afterAll, beforeAll } = await import("vitest")
  let previous = false
  beforeAll(() => {
    previous = is_isolation_disabled()
    set_isolation_disabled(true)
  })
  afterAll(() => {
    set_isolation_disabled(previous)
  })
}
