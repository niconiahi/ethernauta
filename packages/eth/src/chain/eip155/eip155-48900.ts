/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_48900 = {
  "name": "Zircuit Mainnet",
  "shortName": "zircuit-mainnet",
  "chain": "Zircuit Mainnet",
  "icon": "zircuit",
  "rpc": [
    "https://mainnet.zircuit.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://www.zircuit.com/",
  "chainId": 48900,
  "networkId": 48900,
  "explorers": [
    {
      "name": "Zircuit",
      "url": "https://explorer.zircuit.com",
      "standard": "none"
    }
  ]
} satisfies Chain