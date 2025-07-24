/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1024 = {
  "name": "CLV Parachain",
  "shortName": "clv",
  "chain": "CLV",
  "rpc": [
    "https://api-para.clover.finance"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "CLV",
    "symbol": "CLV",
    "decimals": 18
  },
  "infoURL": "https://clv.org",
  "chainId": 1024,
  "networkId": 1024
} satisfies Chain