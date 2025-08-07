/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_328527624 = {
  "name": "Nal Sepolia Testnet",
  "shortName": "nalsep",
  "chain": "ETH",
  "icon": "nal",
  "rpc": [
    "https://testnet-rpc.nal.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://www.nal.network",
  "chainId": 328527624,
  "networkId": 328527624,
  "explorers": [
    {
      "name": "Nal Sepolia Testnet Network Explorer",
      "url": "https://testnet-scan.nal.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain