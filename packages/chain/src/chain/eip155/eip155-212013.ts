/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_212013 = {
  "name": "Heima",
  "shortName": "heima",
  "chain": "Heima",
  "icon": "heima",
  "rpc": [
    "https://rpc.heima-parachain.heima.network",
    "wss://rpc.heima-parachain.heima.network",
    "https://litentry-rpc.dwellir.com",
    "wss://litentry-rpc.dwellir.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Heima",
    "symbol": "HEI",
    "decimals": 18
  },
  "infoURL": "https://heima.network",
  "chainId": 212013,
  "networkId": 212013,
  "explorers": [
    {
      "name": "heima statescan",
      "url": "https://heima.statescan.io",
      "standard": "none"
    }
  ]
} satisfies Chain