/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_48898 = {
  "name": "Zircuit Garfield Testnet",
  "shortName": "zircuit-garfield-testnet",
  "chain": "Zircuit Garfield Testnet",
  "icon": "zircuit",
  "rpc": [
    "https://garfield-testnet.zircuit.com/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://www.zircuit.com/",
  "chainId": 48898,
  "networkId": 48898,
  "explorers": [
    {
      "name": "Zircuit",
      "url": "https://explorer.garfield-testnet.zircuit.com",
      "standard": "none"
    }
  ]
} satisfies Chain