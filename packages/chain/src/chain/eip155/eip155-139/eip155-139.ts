/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_139 = {
  "name": "WoopChain Mainnet",
  "shortName": "woop",
  "chain": "WOOP",
  "icon": "woopchain",
  "rpc": [
    "https://rpc.woop.ai/rpc"
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
    "name": "WoopCoin",
    "symbol": "WOOC",
    "decimals": 18
  },
  "infoURL": "https://wikiwoop.com",
  "chainId": 139,
  "networkId": 139,
  "explorers": [
    {
      "name": "wikiwoop",
      "url": "https://explorer.wikiwoop.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain