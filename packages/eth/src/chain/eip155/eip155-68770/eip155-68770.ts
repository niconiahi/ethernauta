/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_68770 = {
  "name": "DM2 Verse Mainnet",
  "shortName": "dm2",
  "chain": "DM2 Verse",
  "icon": "dm2verse",
  "rpc": [
    "https://rpc.dm2verse.dmm.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "infoURL": "https://seamoon.dmm.com",
  "chainId": 68770,
  "networkId": 68770,
  "explorers": [
    {
      "name": "DM2Verse Explorer",
      "url": "https://explorer.dm2verse.dmm.com",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-248"
  }
} satisfies Chain