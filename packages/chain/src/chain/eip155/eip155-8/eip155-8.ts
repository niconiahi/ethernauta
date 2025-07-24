/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_8 = {
  "name": "Ubiq",
  "shortName": "ubq",
  "chain": "UBQ",
  "rpc": [
    "https://rpc.octano.dev",
    "https://pyrus2.ubiqscan.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ubiq Ether",
    "symbol": "UBQ",
    "decimals": 18
  },
  "infoURL": "https://ubiqsmart.com",
  "chainId": 8,
  "networkId": 8,
  "slip44": 108,
  "explorers": [
    {
      "name": "ubiqscan",
      "url": "https://ubiqscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain