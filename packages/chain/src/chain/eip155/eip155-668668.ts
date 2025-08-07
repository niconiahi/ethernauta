/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_668668 = {
  "name": "Conwai Mainnet",
  "shortName": "cnw",
  "chain": "CNW",
  "icon": "conwai",
  "rpc": [
    "https://conwai.calderachain.xyz/http"
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
    "name": "Conwai",
    "symbol": "CNW",
    "decimals": 18
  },
  "infoURL": "https://conwai.net",
  "chainId": 668668,
  "networkId": 668668,
  "explorers": [
    {
      "name": "conwaiscan",
      "url": "https://conwai.calderaexplorer.xyz",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain