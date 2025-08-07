/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_167009 = {
  "name": "Taiko Hekla",
  "shortName": "tko-hekla",
  "chain": "ETH",
  "icon": "taiko",
  "rpc": [
    "https://rpc.hekla.taiko.xyz",
    "wss://ws.hekla.taiko.xyz",
    "https://taiko-hekla-rpc.publicnode.com",
    "wss://taiko-hekla-rpc.publicnode.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://taiko.xyz",
  "chainId": 167009,
  "networkId": 167009,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscoutapi.hekla.taiko.xyz",
      "standard": "EIP3091"
    },
    {
      "name": "Routescan",
      "url": "https://hekla.taikoexplorer.com",
      "standard": "EIP3091"
    }
  ],
  "status": "active"
} satisfies Chain