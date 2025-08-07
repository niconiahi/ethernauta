/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1300 = {
  "name": "Glue Mainnet",
  "shortName": "glue",
  "chain": "GLUE",
  "icon": "glue",
  "rpc": [
    "https://rpc.glue.net"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Glue",
    "symbol": "GLUE",
    "decimals": 18
  },
  "infoURL": "https://glue.net/",
  "chainId": 1300,
  "networkId": 1300,
  "explorers": [
    {
      "name": "Glue Explorer",
      "url": "https://explorer.glue.net",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain