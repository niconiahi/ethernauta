/* eslint no-template-curly-in-string: 0 */
export const gen = {
  name: "Blockchain Genesis Mainnet",
  shortName: "GEN",
  chain: "GEN",
  rpc: [
    "https://eu.mainnet.xixoio.com",
    "https://us.mainnet.xixoio.com",
    "https://asia.mainnet.xixoio.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "GEN",
    symbol: "GEN",
    decimals: 18,
  },
  infoURL: "https://www.xixoio.com/",
  chainId: 10101,
  networkId: 10101,
} as const
