/* eslint no-template-curly-in-string: 0 */
export const op = {
  name: "Openpiece Mainnet",
  shortName: "OP",
  chain: "OPENPIECE",
  icon: "openpiece",
  rpc: [
    "https://mainnet.openpiece.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Belly",
    symbol: "BELLY",
    decimals: 18,
  },
  infoURL: "https://cryptopiece.online",
  chainId: 54,
  networkId: 54,
  explorers: [
    {
      name: "Belly Scan",
      url: "https://bellyscan.com",
      standard: "none",
    },
  ],
} as const
