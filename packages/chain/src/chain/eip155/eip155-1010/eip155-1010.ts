/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1010 = {
  "name": "Evrice Network",
  "shortName": "EVC",
  "chain": "EVC",
  "rpc": [
    "https://meta.evrice.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Evrice",
    "symbol": "EVC",
    "decimals": 18
  },
  "infoURL": "https://evrice.com",
  "chainId": 1010,
  "networkId": 1010,
  "slip44": 1020
} satisfies Chain