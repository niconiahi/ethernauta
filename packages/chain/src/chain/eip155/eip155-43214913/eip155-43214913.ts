/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_43214913 = {
  "name": "maistestsubnet",
  "shortName": "mais",
  "chain": "MAI",
  "rpc": [
    "http://174.138.9.169:9650/ext/bc/VUKSzFZKckx4PoZF9gX5QAqLPxbLzvu1vcssPG5QuodaJtdHT/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "maistestsubnet",
    "symbol": "MAI",
    "decimals": 18
  },
  "infoURL": "",
  "chainId": 43214913,
  "networkId": 43214913,
  "slip44": 1,
  "explorers": [
    {
      "name": "maistesntet",
      "url": "http://174.138.9.169:3006/?network=maistesntet",
      "standard": "none"
    }
  ]
} satisfies Chain