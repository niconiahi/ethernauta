/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_224422 = {
  "name": "CONET Sebolia Testnet",
  "shortName": "conet-sebolia",
  "chain": "CONET",
  "icon": "conet",
  "rpc": [
    "https://rpc1.conet.network"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "CONET Sebolia",
    "symbol": "CONET",
    "decimals": 18
  },
  "infoURL": "https://conet.network",
  "chainId": 224422,
  "networkId": 224422,
  "slip44": 1,
  "explorers": [
    {
      "name": "CONET Scan",
      "url": "https://scan.conet.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain