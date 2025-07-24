/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_224433 = {
  "name": "CONET Holesky",
  "shortName": "conet-holesky",
  "chain": "CONET Holesky",
  "icon": "conet",
  "rpc": [
    "https://holeskyrpc1.conet.network"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "CONET Holesky",
    "symbol": "CONET",
    "decimals": 18
  },
  "infoURL": "https://conet.network",
  "chainId": 224433,
  "networkId": 224433,
  "slip44": 2147708081,
  "explorers": [
    {
      "name": "CONET Holesky Scan",
      "url": "https://scan.conet.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain