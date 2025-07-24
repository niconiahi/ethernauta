/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_55 = {
  "name": "Zyx Mainnet",
  "shortName": "ZYX",
  "chain": "ZYX",
  "rpc": [
    "https://rpc-1.zyx.network/",
    "https://rpc-2.zyx.network/",
    "https://rpc-3.zyx.network/",
    "https://rpc-4.zyx.network/",
    "https://rpc-5.zyx.network/",
    "https://rpc-6.zyx.network/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Zyx",
    "symbol": "ZYX",
    "decimals": 18
  },
  "infoURL": "https://zyx.network/",
  "chainId": 55,
  "networkId": 55,
  "explorers": [
    {
      "name": "zyxscan",
      "url": "https://zyxscan.com",
      "standard": "none"
    }
  ]
} satisfies Chain