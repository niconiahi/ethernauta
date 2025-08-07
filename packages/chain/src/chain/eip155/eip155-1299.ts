/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1299 = {
  "name": "Argochain",
  "shortName": "AGC",
  "chain": "Argochain",
  "icon": "argochain",
  "rpc": [
    "https://rpc.devolvedai.com",
    "https://rpc-mainnet.devolvedai.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Argocoin",
    "symbol": "AGC",
    "decimals": 18
  },
  "infoURL": "https://devolvedai.com",
  "chainId": 1299,
  "networkId": 1299,
  "explorers": [
    {
      "name": "Argochain Scanner",
      "url": "https://scanner.argoscan.net",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain