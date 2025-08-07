/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_279 = {
  "name": "BPX Chain",
  "shortName": "bpx",
  "chain": "BPX",
  "icon": "bpx",
  "rpc": [
    "https://rpc.bpxchain.cc"
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
    "name": "BPX",
    "symbol": "BPX",
    "decimals": 18
  },
  "infoURL": "https://bpxchain.cc",
  "chainId": 279,
  "networkId": 279,
  "explorers": [
    {
      "name": "BPX Chain Block Explorer",
      "url": "https://explorer.bpxchain.cc",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain