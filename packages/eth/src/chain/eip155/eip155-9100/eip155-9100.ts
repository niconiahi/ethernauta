/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_9100 = {
  "name": "Genesis Coin",
  "shortName": "GENEC",
  "chain": "Genesis",
  "rpc": [
    "https://genesis-gn.com",
    "wss://genesis-gn.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "GN Coin",
    "symbol": "GNC",
    "decimals": 18
  },
  "infoURL": "https://genesis-gn.com",
  "chainId": 9100,
  "networkId": 9100
} satisfies Chain