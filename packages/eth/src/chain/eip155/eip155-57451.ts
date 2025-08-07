/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_57451 = {
  "name": "COINSEC Network",
  "shortName": "coinsecnetwork",
  "title": "COINSEC Network",
  "chain": "coinsecnetwork",
  "icon": "coinsec",
  "rpc": [
    "https://mainnet-rpc.coinsec.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "COINSEC",
    "symbol": "SEC",
    "decimals": 18
  },
  "infoURL": "https://explorer.coinsec.network/",
  "chainId": 57451,
  "networkId": 57451,
  "explorers": [
    {
      "name": "coinsecnetwork",
      "url": "https://explorer.coinsec.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain