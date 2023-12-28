/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_72992 = {
  "name": "Grok Chain Mainnet",
  "shortName": "GrokChain",
  "chain": "Grok",
  "icon": "grokicon",
  "rpc": [
    "https://mainnet-rpc.grokchain.dev"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Groc",
    "symbol": "GROC",
    "decimals": 18
  },
  "infoURL": "https://grokchain.dev",
  "chainId": 72992,
  "networkId": 72992,
  "explorers": [
    {
      "name": "GrokScan",
      "url": "https://mainnet-explorer.grokchain.dev",
      "standard": "none"
    }
  ]
} satisfies Chain