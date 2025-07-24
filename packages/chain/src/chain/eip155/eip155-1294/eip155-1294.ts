/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1294 = {
  "name": "Bobabeam",
  "shortName": "Bobabeam",
  "chain": "Bobabeam",
  "rpc": [
    "https://bobabeam.boba.network",
    "wss://wss.bobabeam.boba.network",
    "https://replica.bobabeam.boba.network",
    "wss://replica-wss.bobabeam.boba.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Boba Token",
    "symbol": "BOBA",
    "decimals": 18
  },
  "infoURL": "https://boba.network",
  "chainId": 1294,
  "networkId": 1294,
  "explorers": [
    {
      "name": "Bobabeam block explorer",
      "url": "https://blockexplorer.bobabeam.boba.network",
      "standard": "none"
    }
  ]
} satisfies Chain