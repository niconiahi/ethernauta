/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_88888888 = {
  "name": "T.E.A.M Blockchain",
  "shortName": "team",
  "chain": "TEAM",
  "icon": "team",
  "rpc": [
    "https://rpc.teamblockchain.team"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "TEAM",
    "symbol": "$TEAM",
    "decimals": 18
  },
  "infoURL": "https://teamblockchain.team",
  "chainId": 88888888,
  "networkId": 88888888,
  "explorers": [
    {
      "name": "teamscan",
      "url": "https://teamblockchain.team",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain