/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_33333 = {
  "name": "Aves Mainnet",
  "shortName": "avs",
  "chain": "AVS",
  "icon": "aves",
  "rpc": [
    "https://rpc.avescoin.io"
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
    "name": "Aves",
    "symbol": "AVS",
    "decimals": 18
  },
  "infoURL": "https://avescoin.io",
  "chainId": 33333,
  "networkId": 33333,
  "explorers": [
    {
      "name": "avescan",
      "url": "https://avescan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain