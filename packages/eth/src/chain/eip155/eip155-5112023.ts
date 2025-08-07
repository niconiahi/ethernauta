/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_5112023 = {
  "name": "NumBlock Chain",
  "shortName": "NUMB",
  "chain": "NumBlock",
  "icon": "NumBlock",
  "rpc": [
    "https://rpc-mainnet.numblock.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "NUMB Token",
    "symbol": "NUMB",
    "decimals": 18
  },
  "infoURL": "https://numblock.org",
  "chainId": 5112023,
  "networkId": 5112023,
  "explorers": [
    {
      "name": "NumBlock Explorer",
      "url": "https://mainnet.numblock.org",
      "standard": "none"
    }
  ]
} satisfies Chain