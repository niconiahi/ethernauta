/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_305 = {
  "name": "ZKSats Mainnet",
  "shortName": "ZKSats-Mainnet",
  "title": "ZKSats Mainnet",
  "chain": "ZKSats",
  "icon": "zksats",
  "rpc": [
    "https://mainnet.zksats.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BTC",
    "symbol": "BTC",
    "decimals": 18
  },
  "infoURL": "https://zksats.io",
  "chainId": 305,
  "networkId": 305,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.zksats.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain