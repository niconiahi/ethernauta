/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_236 = {
  "name": "Deamchain Testnet",
  "shortName": "deamtest",
  "chain": "Deamchain",
  "icon": "deam",
  "rpc": [
    "https://testnet.deamchain.com"
  ],
  "faucets": [
    "https://faucet.deamchain.com"
  ],
  "nativeCurrency": {
    "name": "Deamchain Native Token",
    "symbol": "DEAM",
    "decimals": 18
  },
  "infoURL": "https://deamchain.com",
  "chainId": 236,
  "networkId": 236,
  "slip44": 1,
  "explorers": [
    {
      "name": "Deamchain Testnet Explorer",
      "url": "https://testnet-scan.deamchain.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain