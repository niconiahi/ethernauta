/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_8989 = {
  "name": "Giant Mammoth Mainnet",
  "shortName": "gmmt",
  "title": "Giant Mammoth Chain",
  "chain": "GMMT",
  "icon": "gmmt",
  "rpc": [
    "https://rpc-asia.gmmtchain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Giant Mammoth Coin",
    "symbol": "GMMT",
    "decimals": 18
  },
  "infoURL": "https://gmmtchain.io/",
  "chainId": 8989,
  "networkId": 8989,
  "explorers": [
    {
      "name": "gmmtscan",
      "url": "https://scan.gmmtchain.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain