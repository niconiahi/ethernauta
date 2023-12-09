/* eslint no-template-curly-in-string: 0 */
export const hmyBS0 = {
  name: "Harmony Testnet Shard 0",
  shortName: "hmy-b-s0",
  chain: "Harmony",
  rpc: [
    "https://api.s0.b.hmny.io",
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
  chainId: 1666700000,
  networkId: 1666700000,
  explorers: [
    {
      name: "Harmony Testnet Block Explorer",
      url: "https://explorer.testnet.harmony.one",
      standard: "EIP3091",
    },
  ],
} as const
