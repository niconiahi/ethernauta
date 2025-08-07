/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_984122 = {
  "name": "Forma",
  "shortName": "forma",
  "chain": "Forma",
  "icon": "forma",
  "rpc": [
    "https://rpc.forma.art"
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
    "name": "TIA",
    "symbol": "TIA",
    "decimals": 18
  },
  "infoURL": "https://forma.art",
  "chainId": 984122,
  "networkId": 984122,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.forma.art",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain