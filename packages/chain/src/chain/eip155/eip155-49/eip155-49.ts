/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_49 = {
  "name": "Ennothem Testnet Pioneer",
  "shortName": "etmpTest",
  "chain": "ETMP",
  "icon": "etmp",
  "rpc": [
    "https://rpc.pioneer.etm.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ennothem",
    "symbol": "ETMP",
    "decimals": 18
  },
  "infoURL": "https://etm.network",
  "chainId": 49,
  "networkId": 49,
  "slip44": 1,
  "explorers": [
    {
      "name": "etmp",
      "url": "https://pioneer.etmscan.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain