/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1297 = {
  "name": "Bobabase Testnet",
  "shortName": "Bobabase",
  "chain": "Bobabase Testnet",
  "rpc": [
    "https://bobabase.boba.network",
    "wss://wss.bobabase.boba.network",
    "https://replica.bobabase.boba.network",
    "wss://replica-wss.bobabase.boba.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Boba Token",
    "symbol": "BOBA",
    "decimals": 18
  },
  "infoURL": "https://boba.network",
  "chainId": 1297,
  "networkId": 1297,
  "slip44": 1,
  "explorers": [
    {
      "name": "Bobabase block explorer",
      "url": "https://blockexplorer.bobabase.boba.network",
      "standard": "none"
    }
  ]
} satisfies Chain