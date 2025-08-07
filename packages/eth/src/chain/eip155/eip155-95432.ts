/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_95432 = {
  "name": "SRICHAIN",
  "shortName": "sriscan",
  "chain": "SRICHAIN",
  "rpc": [
    "https://rpc.sriscan.com/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "SRIX",
    "symbol": "SRIX",
    "decimals": 18
  },
  "infoURL": "https://sriscan.com",
  "chainId": 95432,
  "networkId": 95432,
  "slip44": 108,
  "explorers": [
    {
      "name": "SRICHAIN",
      "url": "https://sriscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain