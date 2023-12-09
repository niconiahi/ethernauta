/* eslint no-template-curly-in-string: 0 */
export const gzMainnet = {
  name: "Gear Zero Network Mainnet",
  shortName: "gz-mainnet",
  chain: "GearZero",
  rpc: [
    "https://gzn.linksme.info",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Gear Zero Network Native Token",
    symbol: "GZN",
    decimals: 18,
  },
  infoURL: "https://token.gearzero.ca/mainnet",
  chainId: 516,
  networkId: 516,
  slip44: 516,
  explorers: [],
} as const