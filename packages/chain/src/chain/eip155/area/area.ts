/* eslint no-template-curly-in-string: 0 */
export const area = {
  name: "Areon Network Mainnet",
  shortName: "area",
  chain: "Areon",
  icon: "areon",
  rpc: [
    "https://mainnet-rpc.areon.network",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Areon",
    symbol: "AREA",
    decimals: 18,
  },
  infoURL: "https://areon.network",
  chainId: 463,
  networkId: 463,
  explorers: [
    {
      name: "AreonScan",
      url: "https://areonscan.com",
      standard: "none",
    },
  ],
} as const