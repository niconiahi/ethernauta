/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2300 = {
  "name": "BOMB Chain",
  "shortName": "bomb",
  "chain": "BOMB",
  "icon": "bomb",
  "rpc": [
    "https://rpc.bombchain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BOMB Token",
    "symbol": "BOMB",
    "decimals": 18
  },
  "infoURL": "https://www.bombchain.com",
  "chainId": 2300,
  "networkId": 2300,
  "explorers": [
    {
      "name": "bombscan",
      "url": "https://bombscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain