/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_271271 = {
  "name": "EgonCoin Testnet",
  "shortName": "EGONt",
  "chain": "EGON",
  "icon": "egonicon",
  "rpc": [
    "https://rpctest.egonscan.com"
  ],
  "faucets": [
    "https://faucet.egonscan.com"
  ],
  "nativeCurrency": {
    "name": "EgonCoin",
    "symbol": "EGON",
    "decimals": 18
  },
  "infoURL": "https://egonscan.com",
  "chainId": 271271,
  "networkId": 271271,
  "slip44": 1,
  "explorers": [
    {
      "name": "EgonCoin Testnet",
      "url": "https://testnet.egonscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain