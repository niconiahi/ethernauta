/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_3030 = {
  "name": "BC Hyper Chain Mainnet",
  "shortName": "BCHYPER",
  "chain": "BC Hyper Chain",
  "icon": "bchyper",
  "rpc": [
    "https://mainapi.bchscan.io"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "VERSATIZE COIN",
    "symbol": "VTCN",
    "decimals": 18
  },
  "infoURL": "https://www.versatizecoin.com/",
  "chainId": 3030,
  "networkId": 3030,
  "explorers": [
    {
      "name": "bcexplorer mainnet",
      "url": "https://bchscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain