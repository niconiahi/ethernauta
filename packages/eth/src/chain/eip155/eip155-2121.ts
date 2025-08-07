/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_2121 = {
  "name": "Catena Mainnet",
  "shortName": "cmcx",
  "chain": "CMCX",
  "icon": "catena",
  "rpc": [
    "https://rpc1.catenarpc.com"
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
    "name": "Catena",
    "symbol": "CMCX",
    "decimals": 18
  },
  "infoURL": "https://catena.network",
  "chainId": 2121,
  "networkId": 2121,
  "explorers": [
    {
      "name": "catenascan",
      "url": "https://catenascan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain