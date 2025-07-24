/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1908 = {
  "name": "Bitcichain Testnet",
  "shortName": "tbitci",
  "chain": "TBITCI",
  "icon": "bitci",
  "rpc": [
    "https://testnet.bitcichain.com"
  ],
  "faucets": [
    "https://faucet.bitcichain.com"
  ],
  "nativeCurrency": {
    "name": "Test Bitci",
    "symbol": "TBITCI",
    "decimals": 18
  },
  "infoURL": "https://www.bitcichain.com",
  "chainId": 1908,
  "networkId": 1908,
  "slip44": 1,
  "explorers": [
    {
      "name": "Bitci Explorer Testnet",
      "url": "https://testnet.bitciexplorer.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain