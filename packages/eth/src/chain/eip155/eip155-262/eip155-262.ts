/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_262 = {
  "name": "SUR Blockchain Network",
  "shortName": "SUR",
  "chain": "SUR",
  "icon": "SUR",
  "rpc": [
    "https://sur.nilin.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Suren",
    "symbol": "SRN",
    "decimals": 18
  },
  "infoURL": "https://surnet.org",
  "chainId": 262,
  "networkId": 1,
  "explorers": [
    {
      "name": "Surnet Explorer",
      "url": "https://explorer.surnet.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain