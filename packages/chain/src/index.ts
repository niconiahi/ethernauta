// Root export carries the shared types/schemas only. Individual
// chains live behind subpath exports — `import { eip155_1 } from
// "@ethernauta/chain/eip155-1"` — so consumers only ever pull the
// chains they actually reference. Dev bundlers can't tree-shake an
// `export *` barrel of 2_300+ files, which is why it isn't one.
export * from "./chain/shared"
