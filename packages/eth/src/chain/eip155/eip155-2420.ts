/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_2420 = {
  "name": "Rufus",
  "shortName": "rufus",
  "chain": "rufus",
  "icon": "rufus",
  "rpc": [
    "https://rufus.calderachain.xyz/http"
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
    "name": "Dogelon",
    "symbol": "ELON",
    "decimals": 18
  },
  "infoURL": "https://rufus.hub.caldera.xyz",
  "chainId": 2420,
  "networkId": 2420,
  "explorers": [
    {
      "name": "Rufus Caldera Explorer",
      "url": "https://rufus.calderaexplorer.xyz",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain