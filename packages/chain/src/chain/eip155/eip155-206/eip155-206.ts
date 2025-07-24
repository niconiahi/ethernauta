/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_206 = {
  "name": "VinuChain Testnet",
  "shortName": "VCTEST",
  "chain": "VinuChain Testnet",
  "icon": "vitainu-testnet",
  "rpc": [
    "https://vinufoundation-rpc.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "VinuChain",
    "symbol": "VС",
    "decimals": 18
  },
  "infoURL": "https://vitainu.org",
  "chainId": 206,
  "networkId": 206,
  "slip44": 1,
  "explorers": [
    {
      "name": "VinuScan Testnet",
      "url": "https://testnet.vinuscan.com",
      "standard": "none"
    }
  ]
} satisfies Chain