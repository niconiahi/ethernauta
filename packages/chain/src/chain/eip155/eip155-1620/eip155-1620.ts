/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1620 = {
  "name": "Atheios",
  "shortName": "ath",
  "chain": "ATH",
  "rpc": [
    "https://rpc.atheios.org/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Atheios Ether",
    "symbol": "ATH",
    "decimals": 18
  },
  "infoURL": "https://atheios.org",
  "chainId": 1620,
  "networkId": 11235813,
  "slip44": 1620
} satisfies Chain