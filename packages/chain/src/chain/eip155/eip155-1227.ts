/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1227 = {
  "name": "Bitcoin Protocol Testnet",
  "shortName": "BTCP",
  "chain": "BTCP Testnet",
  "icon": "btcprotocol",
  "rpc": [
    "https://testnet-chain.btcprotocol.io/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BTC Protocol",
    "symbol": "BTCP",
    "decimals": 18
  },
  "infoURL": "https://btcprotocol.io/",
  "chainId": 1227,
  "networkId": 1227,
  "explorers": [
    {
      "name": "BTCP explorer",
      "url": "https://explorer.btcprotocol.io",
      "standard": "EIP3091"
    }
  ],
  "status": "active"
} satisfies Chain