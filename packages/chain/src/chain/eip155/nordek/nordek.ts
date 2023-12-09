/* eslint no-template-curly-in-string: 0 */
export const nordek = {
  name: "Nordek Mainnet",
  shortName: "nordek",
  chain: "Nordek",
  rpc: [
    "https://mainnet-rpc.nordekscan.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "NRK",
    symbol: "NRK",
    decimals: 18,
  },
  infoURL: "https://nordekscan.com",
  chainId: 81041,
  networkId: 81041,
  explorers: [
    {
      name: "nordek",
      url: "https://nordekscan.com",
      standard: "EIP3091",
    },
  ],
} as const