/* eslint no-template-curly-in-string: 0 */
export const shyftt = {
  name: "Shyft Testnet",
  shortName: "shyftt",
  chain: "SHYFTT",
  icon: "shyft",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Shyft Test Token",
    symbol: "SHYFTT",
    decimals: 18,
  },
  infoURL: "https://shyft.network",
  chainId: 11437,
  networkId: 11437,
  explorers: [
    {
      name: "Shyft Testnet BX",
      url: "https://bx.testnet.shyft.network",
      standard: "EIP3091",
    },
  ],
} as const
