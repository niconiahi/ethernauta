/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_9008 = {
  "name": "Shido Network",
  "shortName": "Shido",
  "chain": "Shido Mainnet",
  "icon": "shidoChain",
  "rpc": [
    "https://shido-mainnet-archive-lb-nw5es9.zeeve.net/USjg7xqUmCZ4wCsqEOOE/rpc",
    "wss://shido-mainnet-archive-lb-nw5es9.zeeve.net/USjg7xqUmCZ4wCsqEOOE/ws",
    "https://evm.shidoscan.net",
    "wss://wss.shidoscan.net"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Shido",
    "symbol": "SHIDO",
    "decimals": 18
  },
  "infoURL": "https://shido.io",
  "chainId": 9008,
  "networkId": 9008,
  "explorers": [
    {
      "name": "Shidoscan",
      "url": "https://shidoscan.com",
      "standard": "none"
    }
  ]
} satisfies Chain