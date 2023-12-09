/* eslint no-template-curly-in-string: 0 */
export const spsTest = {
  name: "SPS Testnet",
  shortName: "SPS-Test",
  chain: "SPS-Testnet",
  rpc: [
    "https://www.3sps.net",
  ],
  faucets: [],
  nativeCurrency: {
    name: "ECG",
    symbol: "ECG",
    decimals: 18,
  },
  infoURL: "https://ssquad.games/",
  chainId: 14000,
  networkId: 14000,
  explorers: [
    {
      name: "SPS Test Explorer",
      url: "https://explorer.3sps.net",
      standard: "EIP3091",
    },
  ],
} as const
