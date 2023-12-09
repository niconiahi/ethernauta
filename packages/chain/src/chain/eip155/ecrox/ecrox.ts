/* eslint no-template-curly-in-string: 0 */
export const ecrox = {
  name: "Ecrox Chain Mainnet",
  shortName: "ecrox",
  chain: "Ecrox Chain",
  icon: "ecrox",
  rpc: [
    "https://mainnet-rpc.ecroxscan.com/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "ECROX COIN",
    symbol: "ECROX",
    decimals: 18,
  },
  infoURL: "https://ecroxcoin.io/",
  chainId: 988207,
  networkId: 988207,
  explorers: [
    {
      name: "Ecrox Chain Explorer",
      url: "https://ecroxscan.com",
      standard: "EIP3091",
    },
  ],
} as const