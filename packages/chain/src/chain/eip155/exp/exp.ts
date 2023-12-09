/* eslint no-template-curly-in-string: 0 */
export const exp = {
  name: "Expanse Network",
  shortName: "exp",
  chain: "EXP",
  rpc: [
    "https://node.expanse.tech",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Expanse Network Ether",
    symbol: "EXP",
    decimals: 18,
  },
  infoURL: "https://expanse.tech",
  chainId: 2,
  networkId: 1,
  slip44: 40,
} as const
