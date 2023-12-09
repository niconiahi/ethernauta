/* eslint no-template-curly-in-string: 0 */
export const tmy = {
  name: "TMY Chain",
  shortName: "tmy",
  chain: "TMY",
  icon: "tmychain",
  rpc: [
    "https://node1.tmyblockchain.org/rpc",
  ],
  faucets: [
    "https://faucet.tmychain.org/",
  ],
  nativeCurrency: {
    name: "TMY",
    symbol: "TMY",
    decimals: 18,
  },
  infoURL: "https://tmychain.org/",
  chainId: 8768,
  networkId: 8768,
} as const
