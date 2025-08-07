/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_9007 = {
  "name": "Shido Testnet Block",
  "shortName": "ShidoTestnet",
  "chain": "Shido Testnet",
  "icon": "shidoChain",
  "rpc": [
    "https://rpc-testnet-nodes.shidoscan.com",
    "wss://wss-testnet-nodes.shidoscan.com"
  ],
  "faucets": [
    "https://testnet.shidoscan.com/faucet"
  ],
  "nativeCurrency": {
    "name": "Shido Testnet Token",
    "symbol": "SHIDO",
    "decimals": 18
  },
  "infoURL": "https://www.nexablock.io",
  "chainId": 9007,
  "networkId": 9007,
  "explorers": [
    {
      "name": "Shidoblock Testnet Explorer",
      "url": "https://testnet.shidoscan.com",
      "standard": "none"
    }
  ]
} satisfies Chain