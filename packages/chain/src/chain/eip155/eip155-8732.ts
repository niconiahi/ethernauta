/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_8732 = {
  "name": "Bullions Smart Chain",
  "shortName": "bln",
  "chain": "Bullions",
  "rpc": [
    "https://rpc.bullionsx.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Bullions",
    "symbol": "BLN",
    "decimals": 18
  },
  "infoURL": "https://www.bullionsx.io",
  "chainId": 8732,
  "networkId": 8732,
  "slip44": 8732,
  "explorers": [
    {
      "name": "Bullionscan",
      "url": "https://bullionscan.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain