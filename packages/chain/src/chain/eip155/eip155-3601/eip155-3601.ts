/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_3601 = {
  "name": "PandoProject Mainnet",
  "shortName": "pando-mainnet",
  "chain": "PandoProject",
  "icon": "pando",
  "rpc": [
    "https://eth-rpc-api.pandoproject.org/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "pando-token",
    "symbol": "PTX",
    "decimals": 18
  },
  "infoURL": "https://www.pandoproject.org/",
  "chainId": 3601,
  "networkId": 3601,
  "explorers": [
    {
      "name": "Pando Mainnet Explorer",
      "url": "https://explorer.pandoproject.org",
      "standard": "none"
    }
  ]
} satisfies Chain