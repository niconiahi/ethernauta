/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_806582 = {
  "name": "Ethpar Testnet",
  "shortName": "ethpar-tesnet",
  "chain": "ETP",
  "icon": "ethpar",
  "rpc": [
    "https://rpc82.testnet.ethpar.net/"
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
    "name": "Ethpar",
    "symbol": "ETP",
    "decimals": 18
  },
  "infoURL": "https://ethpar.com",
  "chainId": 806582,
  "networkId": 806582,
  "explorers": [
    {
      "name": "Ethpar Testnet Explorer",
      "url": "https://dora.testnet.ethpar.net",
      "standard": "none"
    }
  ]
} satisfies Chain