/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1202 = {
  "name": "World Trade Technical Chain Mainnet",
  "shortName": "wtt",
  "chain": "WTT",
  "rpc": [
    "https://rpc.cadaut.com",
    "wss://rpc.cadaut.com/ws"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "World Trade Token",
    "symbol": "WTT",
    "decimals": 18
  },
  "infoURL": "http://www.cadaut.com",
  "chainId": 1202,
  "networkId": 2048,
  "explorers": [
    {
      "name": "WTTScout",
      "url": "https://explorer.cadaut.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain