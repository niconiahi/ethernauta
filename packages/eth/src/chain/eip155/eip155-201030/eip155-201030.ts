/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_201030 = {
  "name": "Alaya Dev Testnet",
  "shortName": "alayadev",
  "chain": "Alaya",
  "icon": "alaya",
  "rpc": [
    "https://devnetopenapi.alaya.network/rpc",
    "wss://devnetopenapi.alaya.network/ws"
  ],
  "faucets": [
    "https://faucet.alaya.network/faucet/?id=f93426c0887f11eb83b900163e06151c"
  ],
  "nativeCurrency": {
    "name": "ATP",
    "symbol": "atp",
    "decimals": 18
  },
  "infoURL": "https://www.alaya.network/",
  "chainId": 201030,
  "networkId": 1,
  "slip44": 1,
  "explorers": [
    {
      "name": "alaya explorer",
      "url": "https://devnetscan.alaya.network",
      "standard": "none"
    }
  ]
} satisfies Chain