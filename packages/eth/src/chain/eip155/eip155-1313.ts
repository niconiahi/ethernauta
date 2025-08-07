/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1313 = {
  "name": "JaiHo Chain",
  "shortName": "JHC",
  "chain": "JaiHoChain",
  "icon": "jaihoIcon",
  "rpc": [
    "https://rpc.jaihochain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "JaiHo",
    "symbol": "JaiHo",
    "decimals": 18
  },
  "infoURL": "https://jaihochain.com",
  "chainId": 1313,
  "networkId": 1313,
  "explorers": [
    {
      "name": "JaiHo Chain Explorer",
      "url": "https://jaihochain.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain