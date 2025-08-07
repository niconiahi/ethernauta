/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_65357 = {
  "name": "Vecno Mainnet",
  "shortName": "ve",
  "chain": "VE",
  "icon": "vecno",
  "rpc": [
    "https://rpc.vecno.org"
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
    "name": "Vecno",
    "symbol": "VE",
    "decimals": 18
  },
  "infoURL": "https://vecno.org",
  "chainId": 65357,
  "networkId": 65357,
  "explorers": [
    {
      "name": "vecno",
      "url": "https://explorer.vecno.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain