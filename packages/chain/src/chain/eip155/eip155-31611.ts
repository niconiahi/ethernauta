/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_31611 = {
  "name": "Mezo Testnet",
  "shortName": "mezo-testnet",
  "chain": "Mezo Testnet",
  "rpc": [
    "https://rpc.test.mezo.org"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Bitcoin",
    "symbol": "BTC",
    "decimals": 18
  },
  "infoURL": "https://mezo.org/",
  "chainId": 31611,
  "networkId": 31611,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.test.mezo.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain