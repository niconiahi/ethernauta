/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_513100 = {
  "name": "ethereum Fair",
  "shortName": "ethf",
  "chain": "ETHF",
  "rpc": [
    "https://rpc.etherfair.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "EthereumFair",
    "symbol": "ETHF",
    "decimals": 18
  },
  "infoURL": "https://etherfair.org",
  "chainId": 513100,
  "networkId": 513100,
  "explorers": [
    {
      "name": "etherfair",
      "url": "https://www.oklink.com/ethf",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain