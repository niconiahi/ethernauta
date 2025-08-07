/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_831 = {
  "name": "CheckDot Blockchain Devnet",
  "shortName": "cdt",
  "chain": "CDT Blockchain",
  "rpc": [
    "https://devnet.checkdot.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "CDT",
    "symbol": "CDT",
    "decimals": 18
  },
  "infoURL": "https://checkdot.io",
  "chainId": 831,
  "networkId": 831,
  "explorers": [
    {
      "name": "CDT Explorer",
      "url": "https://explorer.checkdot.io",
      "standard": "none"
    }
  ]
} satisfies Chain