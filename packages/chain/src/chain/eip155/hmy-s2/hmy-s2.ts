/* eslint no-template-curly-in-string: 0 */
export const hmyS2 = {
  name: "Harmony Mainnet Shard 2",
  shortName: "hmy-s2",
  chain: "Harmony",
  rpc: [
    "https://api.s2.t.hmny.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "ONE",
    symbol: "ONE",
    decimals: 18,
  },
  infoURL: "https://www.harmony.one/",
  chainId: 1666600002,
  networkId: 1666600002,
  slip44: 1023,
  explorers: [
    {
      name: "Harmony Block Explorer",
      url: "https://explorer.harmony.one/blocks/shard/2",
      standard: "none",
    },
  ],
  status: "deprecated",
} as const
