/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_777777 = {
  "name": "Winr Protocol Mainnet",
  "shortName": "winr",
  "chain": "WINR",
  "icon": "winr",
  "rpc": [
    "https://rpc.winr.games"
  ],
  "faucets": [],
  "features": [],
  "nativeCurrency": {
    "name": "Winr",
    "symbol": "WINR",
    "decimals": 18
  },
  "infoURL": "https://winr.games",
  "chainId": 777777,
  "networkId": 777777,
  "explorers": [
    {
      "name": "Winr Protocol Explorer",
      "url": "https://explorer.winr.games",
      "standard": "none"
    }
  ]
} satisfies Chain