/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_75513 = {
  "name": "GEEK Verse Testnet",
  "shortName": "GEEK_Test",
  "chain": "GEEK Test",
  "rpc": [
    "https://rpc-testnet.geekout-pte.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "infoURL": "https://www.geekout-pte.com",
  "chainId": 75513,
  "networkId": 75513,
  "explorers": [
    {
      "name": "Geek Testnet Explorer",
      "url": "https://explorer-testnet.geekout-pte.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain