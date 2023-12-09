/* eslint no-template-curly-in-string: 0 */
export const optest = {
  name: "Openpiece Testnet",
  shortName: "OPtest",
  chain: "OPENPIECE",
  icon: "openpiece",
  rpc: [
    "https://testnet.openpiece.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Belly",
    symbol: "BELLY",
    decimals: 18,
  },
  infoURL: "https://cryptopiece.online",
  chainId: 141,
  networkId: 141,
  explorers: [
    {
      name: "Belly Scan",
      url: "https://testnet.bellyscan.com",
      standard: "none",
    },
  ],
} as const
