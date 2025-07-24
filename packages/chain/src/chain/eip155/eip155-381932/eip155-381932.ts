/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_381932 = {
  "name": "Metal Tahoe C-Chain",
  "shortName": "Tahoe",
  "chain": "Metal",
  "rpc": [
    "https://tahoe.metalblockchain.org/ext/bc/C/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Metal",
    "symbol": "METAL",
    "decimals": 18
  },
  "infoURL": "https://www.metalblockchain.org/",
  "chainId": 381932,
  "networkId": 381932,
  "slip44": 9005,
  "explorers": [
    {
      "name": "metalscan",
      "url": "https://tahoe.metalscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain