/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_201018 = {
  "name": "Alaya Mainnet",
  "shortName": "alaya",
  "chain": "Alaya",
  "icon": "alaya",
  "rpc": [
    "https://openapi.alaya.network/rpc",
    "wss://openapi.alaya.network/ws"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ATP",
    "symbol": "atp",
    "decimals": 18
  },
  "infoURL": "https://www.alaya.network/",
  "chainId": 201018,
  "networkId": 1,
  "explorers": [
    {
      "name": "alaya explorer",
      "url": "https://scan.alaya.network",
      "standard": "none"
    }
  ]
} satisfies Chain