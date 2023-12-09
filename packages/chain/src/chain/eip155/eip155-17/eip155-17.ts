/* eslint no-template-curly-in-string: 0 */
export const eip155_17 = {
  name: "ThaiChain 2.0 ThaiFi",
  shortName: "tfi",
  chain: "TCH",
  rpc: [
    "https://rpc.thaifi.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Thaifi Ether",
    symbol: "TFI",
    decimals: 18,
  },
  infoURL: "https://exp.thaifi.com",
  chainId: 17,
  networkId: 17,
} as const
