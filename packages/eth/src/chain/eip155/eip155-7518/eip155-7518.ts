/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_7518 = {
  "name": "MEVerse Chain Mainnet",
  "shortName": "MEV",
  "chain": "MEVerse",
  "icon": "meverse",
  "rpc": [
    "https://rpc.meversemainnet.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "MEVerse",
    "symbol": "MEV",
    "decimals": 18
  },
  "infoURL": "https://www.meverse.sg",
  "chainId": 7518,
  "networkId": 7518,
  "explorers": [
    {
      "name": "MEVerse Chain Explorer",
      "url": "https://www.meversescan.io",
      "standard": "none"
    }
  ]
} satisfies Chain