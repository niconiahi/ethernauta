/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_11503 = {
  "name": "BEVM Testnet",
  "shortName": "bevm-test",
  "chain": "BEVM",
  "icon": "bevm",
  "rpc": [
    "https://testnet.bevm.io/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BTC",
    "symbol": "BTC",
    "decimals": 18
  },
  "infoURL": "https://bevm.io",
  "chainId": 11503,
  "networkId": 11503,
  "explorers": [
    {
      "name": "bevm testnet scan",
      "url": "https://scan-testnet.bevm.io",
      "standard": "none"
    }
  ]
} satisfies Chain