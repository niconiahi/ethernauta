/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_44445 = {
  "name": "Quantum Network",
  "shortName": "QTM",
  "chain": "Quantum",
  "icon": "quantum",
  "rpc": [
    "https://rpcqtm.avescoin.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Quantum",
    "symbol": "QTM",
    "decimals": 18
  },
  "infoURL": "https://avescoin.io/",
  "chainId": 44445,
  "networkId": 44445,
  "explorers": [
    {
      "name": "Quantum Explorer",
      "url": "https://qtm.avescoin.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain