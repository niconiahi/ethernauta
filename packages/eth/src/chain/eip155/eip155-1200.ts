/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1200 = {
  "name": "Cuckoo Chain",
  "shortName": "cai",
  "title": "Cuckoo Chain",
  "chain": "CuckooAI",
  "rpc": [
    "https://mainnet-rpc.cuckoo.network",
    "wss://mainnet-rpc.cuckoo.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "CuckooAI",
    "symbol": "CAI",
    "decimals": 18
  },
  "infoURL": "https://cuckoo.network",
  "chainId": 1200,
  "networkId": 1200,
  "explorers": [
    {
      "name": "Cuckoo Chain Explorer",
      "url": "https://scan.cuckoo.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain