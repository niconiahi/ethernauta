/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_9797 = {
  "name": "OptimusZ7 Mainnet",
  "shortName": "OZ7m",
  "chain": "OptimusZ7",
  "icon": "OZ7Icon",
  "rpc": [
    "https://rpc.optimusz7.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "OptimusZ7",
    "symbol": "OZ7",
    "decimals": 18
  },
  "infoURL": "http://optimusz7.com",
  "chainId": 9797,
  "networkId": 9797,
  "explorers": [
    {
      "name": "OptimusZ7 Mainnet Explorer",
      "url": "https://explorer.optimusz7.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain