/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_4102 = {
  "name": "AIOZ Network Testnet",
  "shortName": "aioz-testnet",
  "chain": "AIOZ",
  "icon": "aioz",
  "rpc": [
    "https://eth-ds.testnet.aioz.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "testAIOZ",
    "symbol": "AIOZ",
    "decimals": 18
  },
  "infoURL": "https://aioz.network",
  "chainId": 4102,
  "networkId": 4102,
  "slip44": 1,
  "explorers": [
    {
      "name": "AIOZ Network Testnet Explorer",
      "url": "https://testnet.explorer.aioz.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain