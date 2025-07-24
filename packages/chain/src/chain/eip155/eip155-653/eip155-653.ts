/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_653 = {
  "name": "Kalichain Mainnet",
  "shortName": "kalichain",
  "chain": "Kalichain",
  "rpc": [
    "https://rpc.kalichain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "kalis",
    "symbol": "KALIS",
    "decimals": 18
  },
  "infoURL": "https://kalichain.com",
  "chainId": 653,
  "networkId": 653,
  "explorers": [
    {
      "name": "kalichain explorer",
      "url": "https://explorer.kalichain.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain