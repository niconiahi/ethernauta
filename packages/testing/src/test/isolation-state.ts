// Module-level toggle that the per-describe `without_isolation()`
// hook flips on entry and off on exit. The setup file's
// `beforeEach` / `afterEach` reads this flag and skips
// `evm_snapshot` / `evm_revert` when set, letting opted-out
// blocks accumulate state across their tests. Per-worker
// module state — workers don't share it.

let isolation_disabled = false

export function is_isolation_disabled(): boolean {
  return isolation_disabled
}

export function set_isolation_disabled(
  value: boolean,
): void {
  isolation_disabled = value
}
