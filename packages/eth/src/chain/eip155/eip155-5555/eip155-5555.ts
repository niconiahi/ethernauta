/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_5555 = {
  "name": "Chain Verse Mainnet",
  "shortName": "cverse",
  "chain": "CVERSE",
  "icon": "chain_verse",
  "rpc": [
    "https://rpc.chainverse.info"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Oasys",
    "symbol": "OAS",
    "decimals": 18
  },
  "infoURL": "https://chainverse.info",
  "chainId": 5555,
  "networkId": 5555,
  "explorers": [
    {
      "name": "Chain Verse Explorer",
      "url": "https://explorer.chainverse.info",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain