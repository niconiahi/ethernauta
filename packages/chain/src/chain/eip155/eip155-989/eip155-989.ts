/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_989 = {
  "name": "TOP Mainnet",
  "shortName": "top",
  "chain": "TOP",
  "icon": "top",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "TOP",
    "symbol": "TOP",
    "decimals": 6
  },
  "infoURL": "https://www.topnetwork.org/",
  "chainId": 989,
  "networkId": 0,
  "explorers": [
    {
      "name": "topscan.dev",
      "url": "https://www.topscan.io",
      "standard": "none"
    }
  ]
} satisfies Chain