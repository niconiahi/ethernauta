/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_6001 = {
  "name": "BounceBit Mainnet",
  "shortName": "bouncebit-mainnet",
  "chain": "BounceBit",
  "icon": "bouncebit",
  "rpc": [
    "https://fullnode-mainnet.bouncebitapi.com/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BounceBit",
    "symbol": "BB",
    "decimals": 18
  },
  "infoURL": "https://bouncebit.io",
  "chainId": 6001,
  "networkId": 6001,
  "explorers": [
    {
      "name": "BBScan Mainnet Explorer",
      "url": "https://bbscan.io",
      "standard": "none"
    }
  ]
} satisfies Chain