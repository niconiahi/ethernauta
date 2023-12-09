/* eslint no-template-curly-in-string: 0 */
export const hmyS1 = {
  name: "Harmony Mainnet Shard 1",
  shortName: "hmy-s1",
  chain: "Harmony",
  rpc: [
    "https://api.s1.t.hmny.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "ONE",
    symbol: "ONE",
    decimals: 18,
  },
  infoURL: "https://www.harmony.one/",
  chainId: 1666600001,
  networkId: 1666600001,
  slip44: 1023,
  explorers: [
    {
      name: "Harmony Block Explorer",
      url: "https://explorer.harmony.one/blocks/shard/1",
      standard: "none",
    },
  ],
} as const
