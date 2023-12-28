/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1904 = {
  "name": "Sports Chain Network",
  "shortName": "SCN",
  "chain": "SCN",
  "icon": "scn",
  "rpc": [
    "https://rpc.sportschainnetwork.xyz/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "SCN",
    "symbol": "SCN",
    "decimals": 18
  },
  "infoURL": "https://sportschainnetwork.xyz",
  "chainId": 1904,
  "networkId": 1904,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.sportschainnetwork.xyz",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain