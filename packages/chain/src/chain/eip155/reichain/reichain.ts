/* eslint no-template-curly-in-string: 0 */
export const reichain = {
  name: "REI Chain Mainnet",
  shortName: "reichain",
  chain: "REI",
  icon: "reichain",
  rpc: [
    "https://rei-rpc.moonrhythm.io",
  ],
  faucets: [
    "http://kururu.finance/faucet?chainId=55555",
  ],
  nativeCurrency: {
    name: "Rei",
    symbol: "REI",
    decimals: 18,
  },
  infoURL: "https://reichain.io",
  chainId: 55555,
  networkId: 55555,
  explorers: [
    {
      name: "reiscan",
      url: "https://reiscan.com",
      standard: "EIP3091",
    },
  ],
} as const