/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_253368190 = {
  "name": "Flame",
  "shortName": "flame",
  "chain": "Flame",
  "icon": "flame",
  "rpc": [
    "https://rpc.flame.astria.org"
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
  "infoURL": "https://astria.org",
  "chainId": 253368190,
  "networkId": 253368190,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.flame.astria.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain