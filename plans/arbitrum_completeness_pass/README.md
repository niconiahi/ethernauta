# Plan — `arbitrum_completeness_pass`

Mirror of [`../op_completeness_pass/`](../op_completeness_pass/README.md)
for `@ethernauta/arbitrum`. Survey the package against `@arbitrum/sdk`
+ `viem/op-stack`-equivalent Arbitrum tooling, identify gaps, close
them in folder-shaped PRs.

## Status

🟡 **Not started.** The kanban card opens this folder; design lives
here as it solidifies. Sub-surfaces (`D1-1`, `D2-1`, …) and a
canonical PR plan get added before any code lands.

## Scope

Survey targets, in survey order:

1. **`packages/arbitrum/COMPARISON.md`** — read end-to-end. Every ❌
   and every ⚠️ cell is a candidate sub-surface.
2. **`packages/arbitrum/src/bridge/`** — verb-by-verb against
   `@arbitrum/sdk`'s `EthBridger` / `Erc20Bridger` /
   `L1ToL2MessageGasEstimator` / `L2ToL1Message`. Confirm every
   shipped verb has a matching test under `src/bridge/*.test.ts`.
3. **`packages/arbitrum/src/precompiles/`** — 16 precompiles vendored;
   confirm method-binding coverage and that ABIs are pinned to a
   current Nitro version.
4. **`packages/arbitrum/src/methods/`** — `arb_*` JSON-RPC bindings.
   Compare against the [Arbitrum Nitro RPC reference](https://docs.arbitrum.io/build-decentralized-apps/nodes-and-rpcs/01-rpc-methods).
5. **Per-chain deploys** — `src/deploys/`. Chain coverage vs the
   Arbitrum Orbit registry.
6. **Gas estimation** — `estimate_arbitrum_fees` correctness vs L1
   data fee, L2 execution fee, and the post-Nitro retryable
   ticket pricing.
7. **Timeboost** — a new fee market on Arbitrum One. Confirm
   whether ETH UX flows need any awareness.

## Sub-surfaces

_To be filled in once the survey completes. Use the
`op_completeness_pass` numbering convention (`D<N>-<M>` for each
decision)._

## Canonical PR plan

_To be filled in once sub-surfaces are sequenced. Aim for 3-5 PRs._

## Resume pointer

**Status:** 🟡 Not started.

**Suggested first action.** Read `packages/arbitrum/COMPARISON.md`
end-to-end. List every ❌ and ⚠️ cell with its row identifier and
context. That list seeds the sub-surface table above.

**What to read first when picking this up.**

1. `packages/arbitrum/COMPARISON.md` — the gap map.
2. `packages/arbitrum/README.md` — the shipped surface.
3. `../op_completeness_pass/README.md` — the template plan this
   mirrors (decision-ID convention, PR-plan shape, resume-pointer
   format).
4. `../op_completeness_pass/CHANGELOG.md` — see how landed work
   gets logged commit-by-commit.

## Implementation log

_Filled in as PRs land. Mirror `op_completeness_pass/README.md`'s
"PR<N> — what landed" / "Decisions made" / "Verified" template._
