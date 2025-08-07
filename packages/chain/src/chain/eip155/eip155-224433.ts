/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_224433 = {
  "name": "CONET Cancun",
  "shortName": "conet-cancun",
  "chain": "CONET Cancun",
  "icon": "conet",
  "rpc": [
    "https://rpc.conet.network"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "CONET Cancun",
    "symbol": "CONET",
    "decimals": 18
  },
  "infoURL": "https://conet.network",
  "chainId": 224433,
  "networkId": 224433,
  "slip44": 2147708081,
  "explorers": [
    {
      "name": "CONET Cancun Scan",
      "url": "https://cancun.conet.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain