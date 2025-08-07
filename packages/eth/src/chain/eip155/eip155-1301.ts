/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1301 = {
  "name": "Unichain Sepolia Testnet",
  "shortName": "unichain-sep",
  "chain": "ETH",
  "icon": "unichain-testnet",
  "rpc": [
    "https://sepolia.unichain.org",
    "https://unichain-sepolia-rpc.publicnode.com",
    "wss://unichain-sepolia-rpc.publicnode.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://unichain.org",
  "chainId": 1301,
  "networkId": 1301,
  "explorers": [
    {
      "name": "Unichain Sepolia Testnet Explorer",
      "url": "https://unichain-sepolia.blockscout.com",
      "standard": "EIP3091"
    },
    {
      "name": "Unichain Sepolia Testnet Explorer",
      "url": "https://sepolia.uniscan.xyz",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain