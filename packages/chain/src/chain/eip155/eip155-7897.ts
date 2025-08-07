/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_7897 = {
  "name": "arena-z",
  "shortName": "arena-z",
  "title": "arena-z",
  "chain": "arena-z",
  "icon": "arena-z-mainnet",
  "rpc": [
    "https://rpc.arena-z.gg",
    "wss://ws.arena-z.gg"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://raas.gelato.network/rollups/details/public/arena-z",
  "chainId": 7897,
  "networkId": 7897,
  "slip44": 60,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.arena-z.gg",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.gelato.network/bridge/arena-z"
      }
    ]
  }
} satisfies Chain