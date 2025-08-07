/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1209 = {
  "name": "SaitaBlockChain(SBC)",
  "shortName": "SBC",
  "chain": "SaitaBlockChain(SBC)",
  "icon": "SaitaBlockChain(SBC)",
  "rpc": [
    "https://rpc-nodes.saitascan.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "SaitaBlockChain(SBC)",
    "symbol": "STC",
    "decimals": 18
  },
  "infoURL": "https://saitachain.com",
  "chainId": 1209,
  "networkId": 1209,
  "explorers": [
    {
      "name": "Saitascan explorer",
      "url": "https://saitascan.io",
      "standard": "none"
    }
  ]
} satisfies Chain