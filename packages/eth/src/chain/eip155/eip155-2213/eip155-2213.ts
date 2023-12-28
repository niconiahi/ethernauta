/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2213 = {
  "name": "Evanesco Mainnet",
  "shortName": "evanesco",
  "chain": "EVA",
  "icon": "evanesco",
  "rpc": [
    "https://seed4.evanesco.org:8546"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "EVA",
    "symbol": "EVA",
    "decimals": 18
  },
  "infoURL": "https://evanesco.org/",
  "chainId": 2213,
  "networkId": 2213,
  "explorers": [
    {
      "name": "Evanesco Explorer",
      "url": "https://explorer.evanesco.org",
      "standard": "none"
    }
  ]
} satisfies Chain