import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_1138: Chain = {
  name: "AmStar Testnet",
  shortName: "ASARt",
  chain: "AmStar",
  icon: "amstar",
  rpc: [
    "https://testnet-rpc.amstarscan.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "SINSO",
    symbol: "SINSO",
    decimals: 18,
  },
  infoURL: "https://sinso.io",
  chainId: 1138,
  networkId: 1138,
  explorers: [
    {
      name: "amstarscan-testnet",
      url: "https://testnet.amstarscan.com",
      standard: "EIP3091",
    },
  ],
}
