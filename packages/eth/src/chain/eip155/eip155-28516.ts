/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_28516 = {
  "name": "Vizing Testnet",
  "shortName": "Vizing-Testnet",
  "title": "Vizing Testnet",
  "chain": "Vizing Testnet",
  "icon": "vizing",
  "rpc": [
    "https://rpc-sepolia.vizing.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://vizing.com",
  "chainId": 28516,
  "networkId": 28516,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer-sepolia.vizing.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain