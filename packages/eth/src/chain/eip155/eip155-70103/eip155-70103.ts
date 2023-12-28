/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_70103 = {
  "name": "Thinkium Mainnet Chain 103",
  "shortName": "TKM103",
  "chain": "Thinkium",
  "rpc": [
    "https://proxy103.thinkiumrpc.net/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "TKM",
    "symbol": "TKM",
    "decimals": 18
  },
  "infoURL": "https://thinkium.net/",
  "chainId": 70103,
  "networkId": 70103,
  "explorers": [
    {
      "name": "thinkiumscan",
      "url": "https://chain103.thinkiumscan.net",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain