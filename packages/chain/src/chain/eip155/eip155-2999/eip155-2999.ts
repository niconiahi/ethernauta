/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2999 = {
  "name": "BitYuan Mainnet",
  "shortName": "bty",
  "chain": "BTY",
  "icon": "bty",
  "rpc": [
    "https://mainnet.bityuan.com/eth"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BTY",
    "symbol": "BTY",
    "decimals": 18
  },
  "infoURL": "https://www.bityuan.com",
  "chainId": 2999,
  "networkId": 2999,
  "explorers": [
    {
      "name": "BitYuan Block Chain Explorer",
      "url": "https://mainnet.bityuan.com",
      "standard": "none"
    }
  ]
} satisfies Chain