/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_45454 = {
  "name": "Swamps L2",
  "shortName": "SWP",
  "chain": "SWP",
  "icon": "swamps",
  "rpc": [
    "https://swamps.tc.l2aas.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "SWP",
    "symbol": "SWP",
    "decimals": 18
  },
  "infoURL": "https://www.swamps.fi",
  "chainId": 45454,
  "networkId": 45454,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://swamps-explorer.tc.l2aas.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain