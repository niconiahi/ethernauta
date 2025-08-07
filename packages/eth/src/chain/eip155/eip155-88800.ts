/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_88800 = {
  "name": "ZKasino Mainnet",
  "shortName": "ZKasino",
  "chain": "ZKasino",
  "rpc": [
    "https://rpc.zkas.zeeve.net"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ZKAS",
    "symbol": "ZKAS",
    "decimals": 18
  },
  "infoURL": "",
  "chainId": 88800,
  "networkId": 88800,
  "explorers": [
    {
      "name": "Tracehawk",
      "url": "https://explorer.zkas.zeeve.net",
      "standard": "none"
    }
  ]
} satisfies Chain