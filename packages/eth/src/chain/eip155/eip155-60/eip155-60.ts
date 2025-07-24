/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_60 = {
  "name": "GoChain",
  "shortName": "go",
  "chain": "GO",
  "rpc": [
    "https://rpc.gochain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "GoChain Ether",
    "symbol": "GO",
    "decimals": 18
  },
  "infoURL": "https://gochain.io",
  "chainId": 60,
  "networkId": 60,
  "slip44": 6060,
  "explorers": [
    {
      "name": "GoChain Explorer",
      "url": "https://explorer.gochain.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain