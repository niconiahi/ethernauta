/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_9901 = {
  "name": "Zytron Linea Mainnet",
  "shortName": "zytron-linea",
  "chain": "ETH",
  "icon": "zytron",
  "rpc": [
    "https://rpc.zypher.network/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://zytron.zypher.network/",
  "chainId": 9901,
  "networkId": 9901,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.zypher.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain