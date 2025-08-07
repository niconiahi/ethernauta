/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_621847 = {
  "name": "DJT Testnet",
  "shortName": "DJT",
  "chain": "DJT",
  "icon": "djt",
  "rpc": [
    "https://testnet-rpc.trumpchain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "TrumpChain",
    "symbol": "DJT",
    "decimals": 18
  },
  "infoURL": "https://testnet-explorer.trumpchain.io",
  "chainId": 621847,
  "networkId": 621847,
  "explorers": [
    {
      "name": "DJT Testnet Explorer",
      "url": "https://testnet-explorer.trumpchain.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain