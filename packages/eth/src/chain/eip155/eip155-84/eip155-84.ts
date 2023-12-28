/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_84 = {
  "name": "Linqto Devnet",
  "shortName": "linqto-devnet",
  "chain": "LNQ",
  "rpc": [
    "https://linqto-dev.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "XRP",
    "symbol": "XRP",
    "decimals": 18
  },
  "infoURL": "https://linqto.com",
  "chainId": 84,
  "networkId": 84,
  "explorers": [
    {
      "name": "Linqto Devnet Explorer",
      "url": "https://explorer.linqto-dev.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain