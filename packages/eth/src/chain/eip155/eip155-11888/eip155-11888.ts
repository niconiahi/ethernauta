/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_11888 = {
  "name": "SanR Chain",
  "shortName": "SAN",
  "chain": "SanRChain",
  "icon": "sanrchain",
  "rpc": [
    "https://sanrchain-node.santiment.net"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "nSAN",
    "symbol": "nSAN",
    "decimals": 18
  },
  "infoURL": "https://sanr.app",
  "chainId": 11888,
  "networkId": 11888,
  "explorers": [
    {
      "name": "SanR Chain Explorer",
      "url": "https://sanrchain-explorer.santiment.net",
      "standard": "none"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://sanr.app"
      }
    ]
  }
} satisfies Chain