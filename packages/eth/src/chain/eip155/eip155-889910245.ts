/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_889910245 = {
  "name": "PTCESCAN Testnet",
  "shortName": "PTCE",
  "title": "PTCESCAN Testnet",
  "chain": "PTCE",
  "rpc": [
    "https://rpc-testnet.ptcscan.io"
  ],
  "faucets": [
    "https://faucet.ptcscan.io/"
  ],
  "nativeCurrency": {
    "name": "PTCE",
    "symbol": "PTCE",
    "decimals": 18
  },
  "infoURL": "https://ptcscan.io",
  "chainId": 889910245,
  "networkId": 889910245,
  "explorers": [
    {
      "name": "PTCESCAN Testnet Explorer",
      "url": "https://explorer-testnet.ptcscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain