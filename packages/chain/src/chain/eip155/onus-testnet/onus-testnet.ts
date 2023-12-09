/* eslint no-template-curly-in-string: 0 */
export const onusTestnet = {
  name: "ONUS Chain Testnet",
  shortName: "onus-testnet",
  title: "ONUS Chain Testnet",
  chain: "onus",
  rpc: [
    "https://rpc-testnet.onuschain.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "ONUS",
    symbol: "ONUS",
    decimals: 18,
  },
  infoURL: "https://onuschain.io",
  chainId: 1945,
  networkId: 1945,
  explorers: [
    {
      name: "Onus explorer testnet",
      url: "https://explorer-testnet.onuschain.io",
      standard: "EIP3091",
    },
  ],
} as const
