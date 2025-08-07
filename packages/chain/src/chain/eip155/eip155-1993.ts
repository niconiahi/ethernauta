/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1993 = {
  "name": "B3 Sepolia Testnet",
  "shortName": "b3-sepolia",
  "chain": "B3 Sepolia Testnet",
  "icon": "b3",
  "rpc": [
    "https://sepolia.b3.fun"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://b3.fun",
  "chainId": 1993,
  "networkId": 1993,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://sepolia.explorer.b3.fun",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain