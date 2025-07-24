/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_431140 = {
  "name": "Markr Go",
  "shortName": "markr-go",
  "chain": "Unified",
  "icon": "markrgo",
  "rpc": [
    "https://rpc.markr.io/ext/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Avalanche",
    "symbol": "AVAX",
    "decimals": 18
  },
  "infoURL": "https://www.markr.io/",
  "chainId": 431140,
  "networkId": 431140,
  "explorers": [],
  "status": "incubating"
} satisfies Chain