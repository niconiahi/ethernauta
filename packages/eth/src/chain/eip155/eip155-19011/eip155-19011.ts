/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_19011 = {
  "name": "HOME Verse Mainnet",
  "shortName": "HMV",
  "chain": "HOME Verse",
  "icon": "home_verse",
  "rpc": [
    "https://rpc.mainnet.oasys.homeverse.games/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "infoURL": "https://www.homeverse.games/",
  "chainId": 19011,
  "networkId": 19011,
  "explorers": [
    {
      "name": "HOME Verse Explorer",
      "url": "https://explorer.oasys.homeverse.games",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-248"
  }
} satisfies Chain