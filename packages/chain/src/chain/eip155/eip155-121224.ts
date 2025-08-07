/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_121224 = {
  "name": "Fushuma",
  "shortName": "fushuma",
  "chain": "Fushuma",
  "rpc": [
    "https://rpc.fushuma.com"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "FUSHUMA",
    "symbol": "FUMA",
    "decimals": 18
  },
  "infoURL": "",
  "chainId": 121224,
  "networkId": 121224,
  "explorers": [
    {
      "name": "FumaScan",
      "url": "https://fumascan.com",
      "standard": "none"
    }
  ]
} satisfies Chain