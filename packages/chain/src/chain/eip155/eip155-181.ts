/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_181 = {
  "name": "Waterfall Network",
  "shortName": "water",
  "chain": "Waterfall Network",
  "icon": "waterfall-main",
  "rpc": [
    "https://rpc.waterfall.network/"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "WATER",
    "symbol": "WATER",
    "decimals": 18
  },
  "infoURL": "https://waterfall.network",
  "chainId": 181,
  "networkId": 181,
  "explorers": []
} satisfies Chain