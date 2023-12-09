/* eslint no-template-curly-in-string: 0 */
export const testdubx = {
  name: "Dubxcoin testnet",
  shortName: "testdubx",
  chain: "TESTDUBX",
  rpc: [
    "https://rpctestnet.arabianchain.org",
  ],
  faucets: [
    "https://faucet.arabianchain.org/",
  ],
  nativeCurrency: {
    name: "Dubxcoin testnet",
    symbol: "TDUBX",
    decimals: 18,
  },
  infoURL: "https://arabianchain.org",
  chainId: 3270,
  networkId: 3270,
} as const
