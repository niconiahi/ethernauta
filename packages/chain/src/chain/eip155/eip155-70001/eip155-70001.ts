/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_70001 = {
  "name": "Thinkium Mainnet Chain 1",
  "shortName": "TKM1",
  "chain": "Thinkium",
  "rpc": [
    "https://proxy1.thinkiumrpc.net/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "TKM",
    "symbol": "TKM",
    "decimals": 18
  },
  "infoURL": "https://thinkium.net/",
  "chainId": 70001,
  "networkId": 70001,
  "explorers": [
    {
      "name": "thinkiumscan",
      "url": "https://chain1.thinkiumscan.net",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain