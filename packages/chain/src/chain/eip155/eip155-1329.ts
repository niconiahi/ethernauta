/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1329 = {
  "name": "Sei Network",
  "shortName": "sei",
  "chain": "Sei",
  "icon": "seiv2",
  "rpc": [
    "https://evm-rpc.sei-apis.com",
    "wss://evm-ws.sei-apis.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Sei",
    "symbol": "SEI",
    "decimals": 18
  },
  "infoURL": "https://www.sei.io",
  "chainId": 1329,
  "networkId": 1329,
  "slip44": 19000118,
  "explorers": [
    {
      "name": "Seitrace",
      "url": "https://seitrace.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain