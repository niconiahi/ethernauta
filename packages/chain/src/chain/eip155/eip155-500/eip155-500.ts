/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_500 = {
  "name": "Camino C-Chain",
  "shortName": "Camino",
  "chain": "CAM",
  "icon": "camino",
  "rpc": [
    "https://api.camino.network/ext/bc/C/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Camino",
    "symbol": "CAM",
    "decimals": 18
  },
  "infoURL": "https://camino.network/",
  "chainId": 500,
  "networkId": 1000,
  "explorers": [
    {
      "name": "blockexplorer",
      "url": "https://suite.camino.network/explorer",
      "standard": "none"
    }
  ]
} satisfies Chain