# Plan — `zksync_completeness_pass`

Mirror of [`../op_completeness_pass/`](../op_completeness_pass/README.md)
for `@ethernauta/zksync`. Survey the package against `zksync-ethers` +
the official `viem/zksync` chain extension, identify gaps, close them
in folder-shaped PRs.

## Status

🟡 **Not started.** The kanban card opens this folder; design lives
here as it solidifies. Sub-surfaces (`D1-1`, `D2-1`, …) and a
canonical PR plan get added before any code lands.

## Scope

Survey targets, in survey order:

1. **`packages/zksync/COMPARISON.md`** — read end-to-end. Every ❌
   and every ⚠️ cell is a candidate sub-surface.
2. **`packages/zksync/src/bridge/`** — verb-by-verb against
   `zksync-ethers`'s `L1Bridge` / `L2Bridge` / `Provider` deposit
   + withdraw + claim-failed-deposit lifecycle. Confirm every
   shipped verb has a matching test.
3. **`packages/zksync/src/system-contracts/`** — system contract
   ABIs pinned to a current zkSync Era release; confirm method
   coverage.
4. **`packages/zksync/src/methods/`** — `zks_*` JSON-RPC bindings.
   Compare against the [zkSync Era RPC reference](https://docs.zksync.io/zksync-protocol/api/zks-rpc).
5. **0x71 (EIP-712) transaction encoder + signer** — the
   zkSync-specific tx type. Confirm encode/decode round-trips,
   confirm the signer integration path. Compare against
   `zksync-ethers`'s `Wallet.signTransaction` for the same type.
6. **Per-chain L1 deploys** — `src/deploys/`. Coverage vs zkSync
   Era's published deployment list + emerging ZK Stack chains.
7. **Gas estimation** — `estimate_zksync_fees` correctness vs the
   pubdata pricing model + the gas-per-pubdata factor.
8. **Paymaster support** — zkSync's native paymaster flow. Confirm
   whether dapp UX requires any first-class helper.

## Sub-surfaces

_To be filled in once the survey completes. Use the
`op_completeness_pass` numbering convention (`D<N>-<M>` for each
decision)._

## Canonical PR plan

_To be filled in once sub-surfaces are sequenced. Aim for 3-5 PRs._

## Resume pointer

**Status:** 🟡 Not started.

**Suggested first action.** Read `packages/zksync/COMPARISON.md`
end-to-end. List every ❌ and ⚠️ cell with its row identifier and
context. That list seeds the sub-surface table above.

**What to read first when picking this up.**

1. `packages/zksync/COMPARISON.md` — the gap map.
2. `packages/zksync/README.md` — the shipped surface.
3. `../op_completeness_pass/README.md` — the template plan this
   mirrors (decision-ID convention, PR-plan shape, resume-pointer
   format).
4. `../op_completeness_pass/CHANGELOG.md` — see how landed work
   gets logged commit-by-commit.

## Implementation log

_Filled in as PRs land. Mirror `op_completeness_pass/README.md`'s
"PR<N> — what landed" / "Decisions made" / "Verified" template._
