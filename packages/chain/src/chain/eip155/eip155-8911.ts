/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_8911 = {
  "name": "Algen",
  "shortName": "alg",
  "chain": "ALG",
  "icon": "alg",
  "rpc": [
    "https://rpc.algen.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ALG",
    "symbol": "ALG",
    "decimals": 18
  },
  "infoURL": "https://www.algen.network",
  "chainId": 8911,
  "networkId": 8911,
  "explorers": [
    {
      "name": "algscan",
      "url": "https://scan.algen.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain