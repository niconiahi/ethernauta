/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_4202 = {
  "name": "Lisk Sepolia Testnet",
  "shortName": "lisksep",
  "chain": "ETH",
  "icon": "lisk",
  "rpc": [
    "https://rpc.sepolia-api.lisk.com"
  ],
  "faucets": [
    "https://app.optimism.io/faucet"
  ],
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://lisk.com",
  "chainId": 4202,
  "networkId": 4202,
  "slip44": 134,
  "explorers": [
    {
      "name": "liskscout",
      "url": "https://sepolia-blockscout.lisk.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain