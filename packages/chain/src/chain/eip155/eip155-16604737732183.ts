/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_16604737732183 = {
  "name": "Flame Testnet",
  "shortName": "flame-testnet",
  "chain": "Flame",
  "icon": "flame",
  "rpc": [
    "https://rpc.flame.dawn-1.astria.org"
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
  "chainId": 16604737732183,
  "networkId": 16604737732183,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.flame.dawn-1.astria.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain