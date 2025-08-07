/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_699 = {
  "name": "Matchain Testnet",
  "shortName": "tMatchain",
  "chain": "Matchain",
  "icon": "matchain",
  "rpc": [
    "https://testnet-rpc.matchain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BNB",
    "symbol": "BNB",
    "decimals": 18
  },
  "infoURL": "https://www.matchain.io",
  "chainId": 699,
  "networkId": 699,
  "explorers": [
    {
      "name": "Matchscan Testnet",
      "url": "https://testnet.matchscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain