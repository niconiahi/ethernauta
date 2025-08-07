/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1380012617 = {
  "name": "RARI Chain Mainnet",
  "shortName": "rari-mainnet",
  "chain": "RARI",
  "rpc": [
    "https://rari.calderachain.xyz/http"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ethereum",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://rarichain.org/",
  "chainId": 1380012617,
  "networkId": 1380012617,
  "explorers": [
    {
      "name": "rarichain-explorer",
      "url": "https://mainnet.explorer.rarichain.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain