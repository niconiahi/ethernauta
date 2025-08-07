/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1698369 = {
  "name": "Primea Network Testnet",
  "shortName": "test-goldpn",
  "chain": "Primea Network Testnet",
  "icon": "prim",
  "rpc": [
    "http://test-rpc.primeanetwork.com/rpc-http",
    "https://test-rpc.primeanetwork.com/rpc-https",
    "ws://test-rpc.primeanetwork.com/rpc-ws",
    "wss://test-rpc.primeanetwork.com/rpc-wss"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "GoldPrimeaNetwork Test",
    "symbol": "GOLDPN",
    "decimals": 18
  },
  "infoURL": "https://primeanetwork.com",
  "chainId": 1698369,
  "networkId": 1698369,
  "explorers": []
} satisfies Chain