/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_68775 = {
  "name": "DM2 Verse Testnet",
  "shortName": "dm2t",
  "chain": "DM2 Verse",
  "icon": "dm2verse",
  "rpc": [
    "https://rpc.testnet.dm2verse.dmm.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "infoURL": "https://seamoon.dmm.com",
  "chainId": 68775,
  "networkId": 68775,
  "explorers": [
    {
      "name": "DM2Verse Testnet Explorer",
      "url": "https://explorer.testnet.dm2verse.dmm.com",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-248"
  }
} satisfies Chain