/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_225 = {
  "name": "LACHAIN Mainnet",
  "shortName": "LA",
  "chain": "LA",
  "icon": "lachain-io",
  "rpc": [
    "https://rpc-mainnet.lachain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "LA",
    "symbol": "LA",
    "decimals": 18
  },
  "infoURL": "https://lachain.io",
  "chainId": 225,
  "networkId": 225,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://scan.lachain.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain