/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_70000 = {
  "name": "Thinkium Mainnet Chain 0",
  "shortName": "TKM0",
  "chain": "Thinkium",
  "rpc": [
    "https://proxy.thinkiumrpc.net/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "TKM",
    "symbol": "TKM",
    "decimals": 18
  },
  "infoURL": "https://thinkium.net/",
  "chainId": 70000,
  "networkId": 70000,
  "explorers": [
    {
      "name": "thinkiumscan",
      "url": "https://chain0.thinkiumscan.net",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain