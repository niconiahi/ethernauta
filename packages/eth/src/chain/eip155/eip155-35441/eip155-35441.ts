/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_35441 = {
  "name": "Q Mainnet",
  "shortName": "q",
  "chain": "Q",
  "icon": "q",
  "rpc": [
    "https://rpc.q.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Q token",
    "symbol": "Q",
    "decimals": 18
  },
  "infoURL": "https://q.org",
  "chainId": 35441,
  "networkId": 35441,
  "explorers": [
    {
      "name": "Q explorer",
      "url": "https://explorer.q.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain