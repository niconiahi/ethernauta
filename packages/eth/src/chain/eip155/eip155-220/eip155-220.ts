/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_220 = {
  "name": "Scalind Testnet",
  "shortName": "sepscal",
  "chain": "ETH",
  "icon": "scalind",
  "rpc": [
    "https://rpc-sepolia.scalind.com"
  ],
  "faucets": [
    "https://faucet.scalind.com"
  ],
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://scalind.com",
  "chainId": 220,
  "networkId": 220,
  "explorers": [
    {
      "name": "scalind",
      "url": "https://explorer-sepolia.scalind.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain