/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_8691942025 = {
  "name": "ONFA Chain",
  "shortName": "onfa",
  "title": "ONFA Chain",
  "chain": "onfa",
  "icon": "onfachain",
  "rpc": [
    "https://rpc.onfa.io",
    "https://rpc.onfachain.com",
    "wss://ws.onfa.io",
    "wss://ws.onfachain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Onfa Coin",
    "symbol": "OFC",
    "decimals": 18
  },
  "infoURL": "https://onfa.io",
  "chainId": 8691942025,
  "networkId": 8691942025,
  "explorers": [
    {
      "name": "ONFA Scan",
      "url": "https://onfascan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain