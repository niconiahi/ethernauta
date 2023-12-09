/* eslint no-template-curly-in-string: 0 */
export const tadil = {
  name: "ADIL Testnet",
  shortName: "tadil",
  chain: "ADIL",
  icon: "adil",
  rpc: [
    "https://testnet.adilchain-rpc.io",
  ],
  faucets: [
    "https://testnet-faucet.adil-scan.io",
  ],
  nativeCurrency: {
    name: "Testnet ADIL",
    symbol: "ADIL",
    decimals: 18,
  },
  infoURL: "https://adilchain.io",
  chainId: 7575,
  networkId: 7575,
  explorers: [
    {
      name: "ADIL Testnet Explorer",
      url: "https://testnet.adilchain-scan.io",
      standard: "EIP3091",
    },
  ],
} as const
