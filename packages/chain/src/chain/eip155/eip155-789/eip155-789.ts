/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_789 = {
  "name": "Patex",
  "shortName": "peth",
  "chain": "ETH",
  "icon": "patex",
  "rpc": [
    "https://rpc.patex.io/"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://patex.io/",
  "chainId": 789,
  "networkId": 789,
  "explorers": [
    {
      "name": "patexscan",
      "url": "https://patexscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain