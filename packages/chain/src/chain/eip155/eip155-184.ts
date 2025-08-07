/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_184 = {
  "name": "Dojima Testnet",
  "shortName": "dojtestnet",
  "chain": "Dojima",
  "icon": "dojima",
  "rpc": [
    "https://rpc-test-d11k.dojima.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Dojima",
    "symbol": "DOJ",
    "decimals": 18
  },
  "infoURL": "https://www.dojima.network/",
  "chainId": 184,
  "networkId": 184,
  "explorers": [
    {
      "name": "Dojima Testnet Explorer",
      "url": "https://explorer-test.dojima.network",
      "standard": "none"
    }
  ]
} satisfies Chain