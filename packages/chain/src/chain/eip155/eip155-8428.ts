/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_8428 = {
  "name": "THAT Mainnet",
  "shortName": "THAT",
  "chain": "THAT",
  "icon": "that",
  "rpc": [
    "https://api.thatchain.io",
    "https://api.thatchain.io/mainnet"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "THAT",
    "symbol": "THAT",
    "decimals": 18
  },
  "infoURL": "https://that.website",
  "chainId": 8428,
  "networkId": 8428,
  "explorers": [
    {
      "name": "THAT Explorer",
      "url": "https://that.blockscout.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain