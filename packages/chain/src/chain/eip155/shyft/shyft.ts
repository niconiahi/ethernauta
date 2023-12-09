/* eslint no-template-curly-in-string: 0 */
export const shyft = {
  name: "Shyft Mainnet",
  shortName: "shyft",
  chain: "SHYFT",
  icon: "shyft",
  rpc: [
    "https://rpc.shyft.network/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Shyft",
    symbol: "SHYFT",
    decimals: 18,
  },
  infoURL: "https://shyft.network",
  chainId: 7341,
  networkId: 7341,
  slip44: 2147490989,
  explorers: [
    {
      name: "Shyft BX",
      url: "https://bx.shyft.network",
      standard: "EIP3091",
    },
  ],
} as const
