/* eslint no-template-curly-in-string: 0 */
export const eip155_1618 = {
  name: "Catecoin Chain Mainnet",
  shortName: "cate",
  chain: "Catechain",
  rpc: [
    "https://send.catechain.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Catecoin",
    symbol: "CATE",
    decimals: 18,
  },
  infoURL: "https://catechain.com",
  chainId: 1618,
  networkId: 1618,
} as const
