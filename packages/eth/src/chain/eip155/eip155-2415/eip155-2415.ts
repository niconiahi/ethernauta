/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2415 = {
  "name": "XODEX",
  "shortName": "xodex",
  "chain": "XODEX",
  "icon": "xodex",
  "rpc": [
    "https://mainnet.xo-dex.com/rpc",
    "https://xo-dex.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "XODEX Native Token",
    "symbol": "XODEX",
    "decimals": 18
  },
  "infoURL": "https://xo-dex.com",
  "chainId": 2415,
  "networkId": 10,
  "explorers": [
    {
      "name": "XODEX Explorer",
      "url": "https://explorer.xo-dex.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain