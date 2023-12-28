/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1008 = {
  "name": "Eurus Mainnet",
  "shortName": "eun",
  "chain": "EUN",
  "icon": "eurus",
  "rpc": [
    "https://mainnet.eurus.network/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Eurus",
    "symbol": "EUN",
    "decimals": 18
  },
  "infoURL": "https://eurus.network",
  "chainId": 1008,
  "networkId": 1008,
  "explorers": [
    {
      "name": "eurusexplorer",
      "url": "https://explorer.eurus.network",
      "standard": "none"
    }
  ]
} satisfies Chain