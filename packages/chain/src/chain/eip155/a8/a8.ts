/* eslint no-template-curly-in-string: 0 */
export const a8 = {
  name: "Ancient8 Testnet",
  shortName: "a8",
  chain: "Ancient8",
  icon: "ancient8",
  rpc: [
    "https://rpc-testnet.ancient8.gg",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://ancient8.gg/",
  chainId: 2863311531,
  networkId: 2863311531,
  explorers: [
    {
      name: "a8scan-testnet",
      url: "https://testnet.a8scan.io",
      standard: "EIP3091",
    },
  ],
} as const
