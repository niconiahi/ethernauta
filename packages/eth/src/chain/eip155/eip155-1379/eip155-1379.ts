/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1379 = {
  "name": "Kalar Chain",
  "shortName": "KLC",
  "chain": "KLC",
  "icon": "kalarchain",
  "rpc": [
    "https://rpc-api.kalarchain.tech"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Kalar",
    "symbol": "KLC",
    "decimals": 18
  },
  "infoURL": "https://kalarchain.tech",
  "chainId": 1379,
  "networkId": 1379,
  "explorers": [
    {
      "name": "kalarscan",
      "url": "https://explorer.kalarchain.tech",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain