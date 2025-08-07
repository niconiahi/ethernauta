/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_632 = {
  "name": "NFB Chain",
  "shortName": "nfbchain",
  "chain": "NFB Chain",
  "rpc": [
    "https://node.nfbchain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "NFBCoin",
    "symbol": "NFBC",
    "decimals": 18
  },
  "infoURL": "https://nfbchain.com/",
  "chainId": 632,
  "networkId": 632,
  "explorers": [
    {
      "name": "NFB Chain Explorer",
      "url": "https://scan.nfbchain.com",
      "standard": "none"
    }
  ]
} satisfies Chain