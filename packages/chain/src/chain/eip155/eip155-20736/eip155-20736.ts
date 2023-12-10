import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_20736: Chain = {
  name: "P12 Chain",
  shortName: "p12",
  chain: "P12",
  icon: "p12",
  rpc: [
    "https://rpc-chain.p12.games",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Hooked P2",
    symbol: "hP2",
    decimals: 18,
  },
  infoURL: "https://p12.network",
  chainId: 20736,
  networkId: 20736,
  explorers: [
    {
      name: "P12 Chain Explorer",
      url: "https://explorer.p12.games",
      standard: "EIP3091",
    },
  ],
}
