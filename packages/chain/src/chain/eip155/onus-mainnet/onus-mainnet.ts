/* eslint no-template-curly-in-string: 0 */
export const onusMainnet = {
  name: "ONUS Chain Mainnet",
  shortName: "onus-mainnet",
  title: "ONUS Chain Mainnet",
  chain: "onus",
  rpc: [
    "https://rpc.onuschain.io",
    "wss://ws.onuschain.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "ONUS",
    symbol: "ONUS",
    decimals: 18,
  },
  infoURL: "https://onuschain.io",
  chainId: 1975,
  networkId: 1975,
  explorers: [
    {
      name: "Onus explorer mainnet",
      url: "https://explorer.onuschain.io",
      standard: "EIP3091",
    },
  ],
} as const