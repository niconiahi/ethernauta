import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_1388: Chain = {
  name: "AmStar Mainnet",
  shortName: "ASAR",
  chain: "AmStar",
  icon: "amstar",
  rpc: [
    "https://mainnet-rpc.amstarscan.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "SINSO",
    symbol: "SINSO",
    decimals: 18,
  },
  infoURL: "https://sinso.io",
  chainId: 1388,
  networkId: 1388,
  explorers: [
    {
      name: "amstarscan",
      url: "https://mainnet.amstarscan.com",
      standard: "EIP3091",
    },
  ],
}
