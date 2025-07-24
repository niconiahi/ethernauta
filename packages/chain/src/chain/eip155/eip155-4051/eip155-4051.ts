/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_4051 = {
  "name": "Bobaopera Testnet",
  "shortName": "BobaoperaTestnet",
  "chain": "Bobaopera Testnet",
  "rpc": [
    "https://testnet.bobaopera.boba.network",
    "wss://wss.testnet.bobaopera.boba.network",
    "https://replica.testnet.bobaopera.boba.network",
    "wss://replica-wss.testnet.bobaopera.boba.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Boba Token",
    "symbol": "BOBA",
    "decimals": 18
  },
  "infoURL": "https://boba.network",
  "chainId": 4051,
  "networkId": 4051,
  "slip44": 1,
  "explorers": [
    {
      "name": "Bobaopera Testnet block explorer",
      "url": "https://blockexplorer.testnet.bobaopera.boba.network",
      "standard": "none"
    }
  ]
} satisfies Chain