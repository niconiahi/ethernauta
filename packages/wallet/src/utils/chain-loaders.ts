// Production-only chain loaders. Lives in its own file so the
// `import.meta.glob` call sits behind a dynamic `await import("./chain-loaders")`
// in `chain.ts`'s PROD branch. In dev (`vite build --watch --mode development`),
// the dynamic import is inside a dead `if (import.meta.env.PROD)` branch that
// esbuild eliminates, so Rollup never traces this file and the ~2,600 per-chain
// chunks are never emitted.
//
// In production, the dynamic import IS reachable, Rollup traces here, expands
// the glob into ~2,600 `() => import(...)` entries, and code-splits each chain
// into its own chunk — matching the original eager-glob behavior.

export type ChainModule = Record<string, unknown>

export const CHAIN_LOADERS = import.meta.glob<ChainModule>(
  "../../../chain/src/chain/eip155/eip155-*.ts",
)
