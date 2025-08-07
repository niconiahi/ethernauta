/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_662 = {
  "name": "AmaxSmartchain",
  "shortName": "Amaxsmartchain",
  "chain": "AmaxSmartchain",
  "icon": "ultronsmartchain",
  "rpc": [
    "https://rpc.amaxchain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "amax",
    "symbol": "AMAX",
    "decimals": 18
  },
  "infoURL": "https://amaxchain.io",
  "chainId": 662,
  "networkId": 662,
  "explorers": [
    {
      "name": "Amaxsmartchain explorer",
      "url": "https://scan.amaxchain.io",
      "standard": "EIP3091"
    }
  ],
  "redFlags": [
    "reusedChainId"
  ]
} satisfies Chain