/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1298 = {
  "name": "Argochain Testnet",
  "shortName": "tAGC",
  "chain": "Argochain",
  "icon": "argochain",
  "rpc": [
    "https://rpc-testnet.devolvedai.com",
    "https://test-rpc.devolvedai.com"
  ],
  "faucets": [
    "https://faucet.argoscan.net"
  ],
  "nativeCurrency": {
    "name": "Argocoin",
    "symbol": "AGC",
    "decimals": 18
  },
  "infoURL": "https://devolvedai.com",
  "chainId": 1298,
  "networkId": 1298,
  "explorers": [
    {
      "name": "Argochain Test Scanner",
      "url": "https://test-scanner.devolvedai.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain