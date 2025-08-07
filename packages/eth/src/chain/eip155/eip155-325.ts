/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_325 = {
  "name": "GRVT Exchange",
  "shortName": "grvt",
  "chain": "ETH",
  "icon": "grvt",
  "rpc": [
    "https://rpc.grvt.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://grvt.io/",
  "chainId": 325,
  "networkId": 325,
  "explorers": []
} satisfies Chain