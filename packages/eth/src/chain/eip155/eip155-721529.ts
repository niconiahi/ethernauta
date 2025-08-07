/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_721529 = {
  "name": "ERAM Mainnet",
  "shortName": "ERAM",
  "chain": "ERAM",
  "icon": "eram",
  "rpc": [
    "https://mainnet-rpc.eramscan.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ERAM",
    "symbol": "ERAM",
    "decimals": 18
  },
  "infoURL": "http://doc.eramscan.com/",
  "chainId": 721529,
  "networkId": 721529,
  "explorers": [
    {
      "name": "Eramscan",
      "url": "https://eramscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain