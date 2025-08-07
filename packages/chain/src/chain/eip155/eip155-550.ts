/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_550 = {
  "name": "River",
  "shortName": "river",
  "chain": "river",
  "icon": "river",
  "rpc": [
    "https://mainnet.rpc.river.build",
    "https://towns-mainnet.calderachain.xyz/http"
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
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://www.river.build",
  "chainId": 550,
  "networkId": 550,
  "explorers": [
    {
      "name": "River Explorer",
      "url": "https://explorer.river.build",
      "standard": "EIP3091"
    },
    {
      "name": "River Caldera Explorer",
      "url": "https://towns-mainnet.calderaexplorer.xyz",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain