// Hand-curated `(chain_id, parent_chain_id, rollup_address)` for
// each Orbit chain in v1. The pull script reads addresses off the
// Rollup contract on the parent chain via `cast call`, so the only
// thing that lives here is the entry point to the on-chain read.
//
// Authoritative source for each rollup address: L2BEAT
// (`packages/config/src/projects/<slug>/discovered.json`,
// `entries[*].name === "RollupProxy"`), cross-checked against each
// chain's bridge UI at impl time. Re-verify on bump — Rollup
// addresses are immutable per deployment, but a chain that re-rolls
// (new constructor) counts as a fresh deploy and the entry rotates.

export type OrbitChainConfig = Readonly<{
  chainId: number
  parentChainId: number
  name: string
  rollup: `0x${string}`
  l2BeatSlug: string
}>

export const ORBIT_CHAINS: ReadonlyArray<OrbitChainConfig> =
  [
    {
      chainId: 660279,
      parentChainId: 42161,
      name: "Xai",
      rollup: "0xC47DacFbAa80Bd9D8112F4e8069482c2A3221336",
      l2BeatSlug: "xai",
    },
    {
      chainId: 33139,
      parentChainId: 42161,
      name: "ApeChain",
      rollup: "0x374de579AE15aD59eD0519aeAf1A23F348Df259c",
      l2BeatSlug: "apechain",
    },
    {
      chainId: 1996,
      parentChainId: 42161,
      name: "Sanko",
      rollup: "0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4",
      l2BeatSlug: "sanko",
    },
    {
      chainId: 70700,
      parentChainId: 42161,
      name: "Proof of Play Apex",
      rollup: "0x65AD139061B3f6DDb16170a07b925337ddf42407",
      l2BeatSlug: "popapex",
    },
    {
      chainId: 1380012617,
      parentChainId: 42161,
      name: "RARI Chain",
      rollup: "0x2e988Ea0873C9d712628F0bf38DAFdE754927C89",
      l2BeatSlug: "rari",
    },
    {
      chainId: 1729,
      parentChainId: 1,
      name: "Reya Network",
      rollup: "0x448Bbd134dE1B23976073aB4F2915849b2dcD73A",
      l2BeatSlug: "reya",
    },
    {
      chainId: 98865,
      parentChainId: 1,
      name: "Plume",
      rollup: "0x4eD3F488a5a4417839BbC39712EB76D8Aaee6eE8",
      l2BeatSlug: "plumenetwork",
    },
  ]
