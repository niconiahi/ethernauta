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
    {
      chainId: 666666666,
      parentChainId: 8453,
      name: "Degen Chain",
      rollup: "0xD34F3a11F10DB069173b32d84F02eDA578709143",
      l2BeatSlug: "degen",
    },
    {
      chainId: 2187,
      parentChainId: 42161,
      name: "Game7",
      rollup: "0x60DAdF13101C66F14C958E9141498b0C0eaE0773",
      l2BeatSlug: "game7",
    },
    {
      chainId: 2911,
      parentChainId: 1,
      name: "HYCHAIN",
      rollup: "0x8f98f9ae2f2836Ed3a628c23311Ad9976B9fBF1B",
      l2BeatSlug: "hychain",
    },
    {
      chainId: 10241024,
      parentChainId: 1,
      name: "AlienX",
      rollup: "0x6fa8b24c85409A4fcb541c9964766862aA007f39",
      l2BeatSlug: "alienx",
    },
    {
      chainId: 7887,
      parentChainId: 1,
      name: "Kinto",
      rollup: "0x5073dA9cA4810f3E0aA01c20c7d9d02C3f522e11",
      l2BeatSlug: "kinto",
    },
    {
      chainId: 41455,
      parentChainId: 1,
      name: "Aleph Zero EVM",
      rollup: "0x1CA12290D954CFe022323b6A6Df92113ed6b1C98",
      l2BeatSlug: "alephzero",
    },
    {
      chainId: 111188,
      parentChainId: 1,
      name: "re.al",
      rollup: "0xc4F7B37bE2bBbcF07373F28c61b1A259dfe49d2a",
      l2BeatSlug: "real",
    },
    {
      chainId: 21000000,
      parentChainId: 1,
      name: "Corn",
      rollup: "0x09eD7e66Dd7c7129Ec3994498A521B502Ca7D61b",
      l2BeatSlug: "corn",
    },
  ]
