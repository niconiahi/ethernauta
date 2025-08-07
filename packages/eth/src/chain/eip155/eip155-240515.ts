/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_240515 = {
  "name": "Orange Chain Testnet",
  "shortName": "Orange-Chain-Testnet",
  "title": "Orange Chain Testnet",
  "chain": "Orange Chain",
  "icon": "orange",
  "rpc": [
    "https://testnet-rpc.orangechain.xyz"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BTC",
    "symbol": "BTC",
    "decimals": 18
  },
  "infoURL": "https://orangechain.xyz",
  "chainId": 240515,
  "networkId": 240515,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://testnet-scan.orangechain.xyz",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain