/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_336 = {
  "name": "Shiden",
  "shortName": "sdn",
  "chain": "SDN",
  "icon": "shiden",
  "rpc": [
    "https://shiden.api.onfinality.io/public",
    "https://shiden-rpc.dwellir.com",
    "https://shiden.public.blastapi.io",
    "wss://shiden.api.onfinality.io/public-ws",
    "wss://shiden.public.blastapi.io",
    "wss://shiden-rpc.dwellir.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Shiden",
    "symbol": "SDN",
    "decimals": 18
  },
  "infoURL": "https://shiden.astar.network/",
  "chainId": 336,
  "networkId": 336,
  "explorers": [
    {
      "name": "subscan",
      "url": "https://shiden.subscan.io",
      "standard": "none"
    },
    {
      "name": "blockscout",
      "url": "https://blockscout.com/shiden",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain