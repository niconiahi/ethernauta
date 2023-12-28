/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_70002 = {
  "name": "Thinkium Mainnet Chain 2",
  "shortName": "TKM2",
  "chain": "Thinkium",
  "rpc": [
    "https://proxy2.thinkiumrpc.net/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "TKM",
    "symbol": "TKM",
    "decimals": 18
  },
  "infoURL": "https://thinkium.net/",
  "chainId": 70002,
  "networkId": 70002,
  "explorers": [
    {
      "name": "thinkiumscan",
      "url": "https://chain2.thinkiumscan.net",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain