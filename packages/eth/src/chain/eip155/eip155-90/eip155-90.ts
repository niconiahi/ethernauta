/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_90 = {
  "name": "Garizon Stage0",
  "shortName": "gar-s0",
  "chain": "GAR",
  "icon": "garizon",
  "rpc": [
    "https://s0.garizon.net/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Garizon",
    "symbol": "GAR",
    "decimals": 18
  },
  "infoURL": "https://garizon.com",
  "chainId": 90,
  "networkId": 90,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.garizon.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain