/* eslint no-template-curly-in-string: 0 */
export const eip155_103090 = {
  name: "Crystaleum",
  shortName: "CRFI",
  chain: "crystal",
  icon: "crystal",
  rpc: [
    "https://evm.cryptocurrencydevs.org",
    "https://rpc.crystaleum.org",
  ],
  faucets: [],
  nativeCurrency: {
    name: "CRFI",
    symbol: "◈",
    decimals: 18,
  },
  infoURL: "https://crystaleum.org",
  chainId: 103090,
  networkId: 1,
  explorers: [
    {
      name: "blockscout",
      url: "https://scan.crystaleum.org",
      standard: "EIP3091",
    },
  ],
} as const
