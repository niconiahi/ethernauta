/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_8881 = {
  "name": "Quartz by Unique",
  "shortName": "qtz",
  "chain": "UNQ",
  "icon": "quartz",
  "rpc": [
    "https://rpc-quartz.unique.network",
    "https://quartz.api.onfinality.io/public-ws",
    "https://eu-rpc-quartz.unique.network",
    "https://asia-rpc-quartz.unique.network",
    "https://us-rpc-quartz.unique.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Quartz",
    "symbol": "QTZ",
    "decimals": 18
  },
  "infoURL": "https://unique.network",
  "chainId": 8881,
  "networkId": 8881,
  "explorers": [
    {
      "name": "Unique Scan / Quartz",
      "url": "https://uniquescan.io/quartz",
      "standard": "none"
    }
  ]
} satisfies Chain