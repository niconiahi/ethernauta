/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_698369 = {
  "name": "Primea Network Mainnet",
  "shortName": "goldpn",
  "chain": "Primea Network Mainnet",
  "icon": "prim",
  "rpc": [
    "http://rpc.primeanetwork.com/rpc-http",
    "https://rpc.primeanetwork.com/rpc-https",
    "ws://rpc.primeanetwork.com/rpc-ws",
    "wss://rpc.primeanetwork.com/rpc-wss"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "GoldPrimeaNetwork",
    "symbol": "GOLDPN",
    "decimals": 18
  },
  "infoURL": "https://primeanetwork.com",
  "chainId": 698369,
  "networkId": 698369,
  "explorers": []
} satisfies Chain