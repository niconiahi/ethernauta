/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1188 = {
  "name": "ClubMos Mainnet",
  "shortName": "MOS",
  "chain": "MOS",
  "icon": "clubmos",
  "rpc": [
    "https://mainnet.mosscan.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ClubMos",
    "symbol": "MOS",
    "decimals": 18
  },
  "infoURL": "https://www.mosscan.com",
  "chainId": 1188,
  "networkId": 1188,
  "explorers": [
    {
      "name": "mosscan",
      "url": "https://www.mosscan.com",
      "standard": "none"
    }
  ]
} satisfies Chain