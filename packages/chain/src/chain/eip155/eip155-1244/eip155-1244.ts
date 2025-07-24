/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1244 = {
  "name": "ARC Testnet",
  "shortName": "TARC",
  "chain": "ARC",
  "icon": "arc",
  "rpc": [
    "https://rpc-test-1.archiechain.io"
  ],
  "faucets": [
    "https://faucet.archiechain.io"
  ],
  "nativeCurrency": {
    "name": "ARC",
    "symbol": "ARC",
    "decimals": 18
  },
  "infoURL": "https://archiechain.io/",
  "chainId": 1244,
  "networkId": 1244,
  "slip44": 1,
  "explorers": [
    {
      "name": "archiescan",
      "url": "https://testnet.archiescan.io",
      "standard": "none"
    }
  ]
} satisfies Chain