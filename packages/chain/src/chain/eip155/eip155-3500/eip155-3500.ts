/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_3500 = {
  "name": "Paribu Net Testnet",
  "shortName": "prbtestnet",
  "chain": "PRB",
  "icon": "prb",
  "rpc": [
    "https://rpc.testnet.paribuscan.com"
  ],
  "faucets": [
    "https://faucet.paribuscan.com"
  ],
  "nativeCurrency": {
    "name": "PRB",
    "symbol": "PRB",
    "decimals": 18
  },
  "infoURL": "https://net.paribu.com",
  "chainId": 3500,
  "networkId": 3500,
  "slip44": 1,
  "explorers": [
    {
      "name": "Paribu Net Testnet Explorer",
      "url": "https://testnet.paribuscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain