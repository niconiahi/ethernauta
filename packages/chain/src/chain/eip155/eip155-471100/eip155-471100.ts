/* eslint no-template-curly-in-string: 0 */
export const eip155_471100 = {
  name: "Patex Sepolia Testnet",
  shortName: "psep",
  chain: "ETH",
  rpc: [
    "https://test-rpc.patex.io/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://patex.io/",
  chainId: 471100,
  networkId: 471100,
} as const
