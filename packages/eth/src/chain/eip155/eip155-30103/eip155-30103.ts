/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_30103 = {
  "name": "Cerium Testnet",
  "shortName": "ceri",
  "chain": "CAU",
  "icon": "canxium",
  "rpc": [
    "https://cerium-rpc.canxium.net"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Canxium",
    "symbol": "CAU",
    "decimals": 18
  },
  "infoURL": "https://canxium.org",
  "chainId": 30103,
  "networkId": 30103,
  "slip44": 1,
  "explorers": [
    {
      "name": "canxium explorer",
      "url": "https://cerium-explorer.canxium.net",
      "standard": "none"
    }
  ]
} satisfies Chain