/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_2494104990 = {
  "name": "Tron Shasta",
  "shortName": "tron-shasta",
  "chain": "TRON",
  "icon": "tron",
  "rpc": [
    "https://api.shasta.trongrid.io/jsonrpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Tron",
    "symbol": "TRX",
    "decimals": 6
  },
  "infoURL": "https://tron.network",
  "chainId": 2494104990,
  "networkId": 2494104990,
  "explorers": [
    {
      "name": "shasta tronscan",
      "url": "https://shasta.tronscan.org",
      "standard": "none"
    }
  ]
} satisfies Chain