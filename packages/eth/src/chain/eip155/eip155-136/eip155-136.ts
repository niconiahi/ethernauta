/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_136 = {
  "name": "Deamchain Mainnet",
  "shortName": "deam",
  "chain": "Deamchain",
  "icon": "deam",
  "rpc": [
    "https://mainnet.deamchain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Deamchain Native Token",
    "symbol": "DEAM",
    "decimals": 18
  },
  "infoURL": "https://deamchain.com",
  "chainId": 136,
  "networkId": 136,
  "explorers": [
    {
      "name": "Deamchain Block Explorer",
      "url": "https://scan.deamchain.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain