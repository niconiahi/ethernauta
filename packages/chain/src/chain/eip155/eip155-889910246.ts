/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_889910246 = {
  "name": "PTCESCAN Mainnet",
  "shortName": "POLYTECH",
  "title": "PTCESCAN Mainnet",
  "chain": "PTCE",
  "rpc": [
    "https://rpc.ptcscan.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "PTCE",
    "symbol": "PTCE",
    "decimals": 18
  },
  "infoURL": "https://ptcscan.io",
  "chainId": 889910246,
  "networkId": 889910246,
  "explorers": [
    {
      "name": "PTCESCAN Explorer",
      "url": "https://ptcscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain