/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_29 = {
  "name": "Genesis L1",
  "shortName": "L1",
  "chain": "genesis",
  "rpc": [
    "https://rpc.genesisl1.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "L1 coin",
    "symbol": "L1",
    "decimals": 18
  },
  "infoURL": "https://www.genesisl1.com",
  "chainId": 29,
  "networkId": 29,
  "explorers": [
    {
      "name": "Genesis L1 blockchain explorer",
      "url": "https://explorer.genesisl1.org",
      "standard": "none"
    }
  ]
} satisfies Chain