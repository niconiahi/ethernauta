/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_292003 = {
  "name": "Cipherem Testnet",
  "shortName": "CIP",
  "chain": "Cipherem",
  "icon": "cipherem",
  "rpc": [
    "https://testnet.cipherem.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "CIP",
    "symbol": "CIP",
    "decimals": 18
  },
  "infoURL": "https://www.cipherem.com",
  "chainId": 292003,
  "networkId": 292003,
  "slip44": 1,
  "explorers": [
    {
      "name": "Cipherscan Testnet Explorer",
      "url": "https://cipherscan.net",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain