/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_20073 = {
  "name": "Niza Chain Testnet",
  "shortName": "niza_testnet",
  "chain": "NIZA",
  "icon": "niza",
  "rpc": [
    "https://testnet.nizascan.io/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Niza Global",
    "symbol": "NIZA",
    "decimals": 18
  },
  "infoURL": "https://niza.io",
  "chainId": 20073,
  "networkId": 20073,
  "explorers": [
    {
      "name": "NizaScan",
      "url": "https://testnet.nizascan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain