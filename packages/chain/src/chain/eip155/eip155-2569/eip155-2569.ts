/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2569 = {
  "name": "TechPay Mainnet",
  "shortName": "tpc",
  "chain": "TPC",
  "icon": "techpay",
  "rpc": [
    "https://api.techpay.io/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "TechPay",
    "symbol": "TPC",
    "decimals": 18
  },
  "infoURL": "https://techpay.io/",
  "chainId": 2569,
  "networkId": 2569,
  "explorers": [
    {
      "name": "tpcscan",
      "url": "https://tpcscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain