/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_8285 = {
  "name": "KorthoTest",
  "shortName": "Kortho",
  "chain": "Kortho",
  "rpc": [
    "https://www.krotho-test.net"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Kortho Test",
    "symbol": "KTO",
    "decimals": 11
  },
  "infoURL": "https://www.kortho.io/",
  "chainId": 8285,
  "networkId": 8285,
  "slip44": 1
} satisfies Chain