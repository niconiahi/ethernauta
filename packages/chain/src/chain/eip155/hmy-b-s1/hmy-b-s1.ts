/* eslint no-template-curly-in-string: 0 */
export const hmyBS1 = {
  name: "Harmony Testnet Shard 1",
  shortName: "hmy-b-s1",
  chain: "Harmony",
  rpc: [
    "https://api.s1.b.hmny.io",
  ],
  faucets: [
    "https://faucet.pops.one",
  ],
  nativeCurrency: {
    name: "ONE",
    symbol: "ONE",
    decimals: 18,
  },
  infoURL: "https://www.harmony.one/",
  chainId: 1666700001,
  networkId: 1666700001,
  explorers: [
    {
      name: "Harmony Block Explorer",
      url: "https://explorer.testnet.harmony.one",
      standard: "none",
    },
  ],
} as const
