/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_223 = {
  "name": "B2 Mainnet",
  "shortName": "B2-mainnet",
  "title": "B2 Mainnet",
  "chain": "B2",
  "icon": "bsquare",
  "rpc": [
    "https://mainnet.b2-rpc.com",
    "https://rpc.bsquared.network",
    "https://b2-mainnet.alt.technology",
    "https://b2-mainnet-public.s.chainbase.com",
    "https://rpc.ankr.com/b2"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Bitcoin",
    "symbol": "BTC",
    "decimals": 18
  },
  "infoURL": "https://www.bsquared.network",
  "chainId": 223,
  "networkId": 223,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.bsquared.network",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-213",
    "bridges": [
      {
        "url": "https://www.bsquared.network/bridge"
      }
    ]
  }
} satisfies Chain