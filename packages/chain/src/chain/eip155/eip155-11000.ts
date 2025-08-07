/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_11000 = {
  "name": "KB Chain",
  "shortName": "KBC",
  "chain": "KB",
  "rpc": [
    "https://mainnet-rpc.kbcfoundation.com"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "KBC",
    "symbol": "KBC",
    "decimals": 18
  },
  "infoURL": "https://kbcfoundation.com",
  "chainId": 11000,
  "networkId": 11000,
  "explorers": [
    {
      "name": "KBC Explorer",
      "url": "https://scan.kbcfoundation.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain