/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1490 = {
  "name": "Vitruveo Mainnet",
  "shortName": "vitruveo",
  "title": "Vitruveo is a blockchain for Creators",
  "chain": "Vitruveo",
  "icon": "vitruveo",
  "rpc": [
    "https://rpc.vitruveo.xyz"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "Vitruveo Coin",
    "symbol": "VTRU",
    "decimals": 18
  },
  "infoURL": "https://www.vitruveo.xyz",
  "chainId": 1490,
  "networkId": 1490,
  "explorers": [
    {
      "name": "Vitruveo Explorer",
      "url": "https://explorer.vitruveo.xyz",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain