import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_7576: Chain = {
  name: "Adil Chain V2 Mainnet",
  shortName: "adil",
  chain: "ADIL",
  icon: "adil",
  rpc: [
    "https://adilchain-rpc.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "ADIL",
    symbol: "ADIL",
    decimals: 18,
  },
  infoURL: "https://adilchain.io",
  chainId: 7576,
  networkId: 7576,
  explorers: [
    {
      name: "ADIL Mainnet Explorer",
      url: "https://adilchain-scan.io",
      standard: "EIP3091",
    },
  ],
}
