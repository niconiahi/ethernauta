import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_49: Chain = {
  name: "Ennothem Testnet Pioneer",
  shortName: "etmpTest",
  chain: "ETMP",
  icon: "etmp",
  rpc: [
    "https://rpc.pioneer.etm.network",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ennothem",
    symbol: "ETMP",
    decimals: 18,
  },
  infoURL: "https://etm.network",
  chainId: 49,
  networkId: 49,
  explorers: [
    {
      name: "etmp",
      url: "https://pioneer.etmscan.network",
      standard: "EIP3091",
    },
  ],
}
