/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_625 = {
  "name": "Binary Sepolia",
  "shortName": "thebinaryholdings-sepolia",
  "chain": "The Binary Holdings",
  "rpc": [
    "https://rpc.testnet.thebinaryholdings.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Test BNRY",
    "symbol": "BNRY",
    "decimals": 18
  },
  "infoURL": "",
  "chainId": 625,
  "networkId": 625,
  "explorers": [
    {
      "name": "Tracehawk",
      "url": "https://explorer.sepolia.thebinaryholdings.com",
      "standard": "none"
    }
  ]
} satisfies Chain