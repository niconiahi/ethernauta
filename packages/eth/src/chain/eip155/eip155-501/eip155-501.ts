/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_501 = {
  "name": "Columbus Test Network",
  "shortName": "Columbus",
  "chain": "CAM",
  "icon": "camino",
  "rpc": [
    "https://columbus.camino.network/ext/bc/C/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Camino",
    "symbol": "CAM",
    "decimals": 18
  },
  "infoURL": "https://camino.network/",
  "chainId": 501,
  "networkId": 1001,
  "slip44": 1,
  "explorers": [
    {
      "name": "blockexplorer",
      "url": "https://suite.camino.network/explorer",
      "standard": "none"
    }
  ]
} satisfies Chain