/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_301 = {
  "name": "Bobaopera",
  "shortName": "Bobaopera",
  "chain": "Bobaopera",
  "rpc": [
    "https://bobaopera.boba.network",
    "wss://wss.bobaopera.boba.network",
    "https://replica.bobaopera.boba.network",
    "wss://replica-wss.bobaopera.boba.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Boba Token",
    "symbol": "BOBA",
    "decimals": 18
  },
  "infoURL": "https://boba.network",
  "chainId": 301,
  "networkId": 301,
  "explorers": [
    {
      "name": "Bobaopera block explorer",
      "url": "https://blockexplorer.bobaopera.boba.network",
      "standard": "none"
    }
  ]
} satisfies Chain