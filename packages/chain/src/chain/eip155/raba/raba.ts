/* eslint no-template-curly-in-string: 0 */
export const raba = {
  name: "Raba Network Mainnet",
  shortName: "raba",
  chain: "Raba",
  icon: "raba",
  rpc: [
    "https://rpc.x.raba.app/",
    "wss://rpc.x.raba.app/ws/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Raba",
    symbol: "RABA",
    decimals: 18,
  },
  infoURL: "https://x.raba.app/",
  chainId: 7484,
  networkId: 7484,
  explorers: [
    {
      name: "raba",
      url: "https://x.raba.app/explorer",
      standard: "none",
    },
  ],
} as const