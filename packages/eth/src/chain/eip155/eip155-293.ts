/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_293 = {
  "name": "DaVinci",
  "shortName": "davinci",
  "chain": "DCOIN",
  "icon": "davinci",
  "rpc": [
    "https://rpc.davinci.bz"
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
    "name": "DaVinci",
    "symbol": "DCOIN",
    "decimals": 18
  },
  "infoURL": "https://davinci.bz",
  "chainId": 293,
  "networkId": 293,
  "explorers": [
    {
      "name": "davinciscan",
      "url": "https://mainnet-explorer.davinci.bz",
      "standard": "EIP3091"
    }
  ],
  "status": "active"
} satisfies Chain