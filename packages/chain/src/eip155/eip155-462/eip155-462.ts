/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_462 = {
  name: "Areon Network Testnet",
  shortName: "tarea",
  chain: "Areon",
  icon: "areon",
  rpc: [
    "https://testnet-rpc.areon.network",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Areon",
    symbol: "TAREA",
    decimals: 18,
  },
  infoURL: "https://areon.network",
  chainId: 462,
  networkId: 462,
  explorers: [
    {
      name: "AreonScan",
      url: "https://areonscan.com",
      standard: "none",
    },
  ],
} satisfies Chain
