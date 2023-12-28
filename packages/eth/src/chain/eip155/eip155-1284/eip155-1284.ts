/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1284 = {
  "name": "Moonbeam",
  "shortName": "mbeam",
  "chain": "MOON",
  "rpc": [
    "https://rpc.api.moonbeam.network",
    "wss://wss.api.moonbeam.network",
    "https://moonbeam.publicnode.com",
    "wss://moonbeam.publicnode.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Glimmer",
    "symbol": "GLMR",
    "decimals": 18
  },
  "infoURL": "https://moonbeam.network/networks/moonbeam/",
  "chainId": 1284,
  "networkId": 1284,
  "explorers": [
    {
      "name": "moonscan",
      "url": "https://moonbeam.moonscan.io",
      "standard": "none"
    }
  ]
} satisfies Chain