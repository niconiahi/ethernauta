/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_142857 = {
  "name": "ICPlaza Mainnet",
  "shortName": "ICPlaza",
  "chain": "ICPlaza",
  "icon": "icplaza",
  "rpc": [
    "https://rpcmainnet.ic-plaza.org/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ict",
    "symbol": "ict",
    "decimals": 18
  },
  "infoURL": "https://docs.ic-plaza.org/",
  "chainId": 142857,
  "networkId": 142857,
  "explorers": [
    {
      "name": "ICPlaza",
      "url": "https://browsemainnet.ic-plaza.org/index",
      "standard": "none"
    }
  ]
} satisfies Chain