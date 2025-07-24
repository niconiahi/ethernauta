/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2077 = {
  "name": "Quokkacoin Mainnet",
  "shortName": "QKA",
  "chain": "Qkacoin",
  "rpc": [
    "https://rpc.qkacoin.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Qkacoin",
    "symbol": "QKA",
    "decimals": 18
  },
  "infoURL": "https://qkacoin.org",
  "chainId": 2077,
  "networkId": 2077,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.qkacoin.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain