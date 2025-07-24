/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_43288 = {
  "name": "Boba Avax",
  "shortName": "bobaavax",
  "chain": "Boba Avax",
  "rpc": [
    "https://avax.boba.network",
    "wss://wss.avax.boba.network",
    "https://replica.avax.boba.network",
    "wss://replica-wss.avax.boba.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Boba Token",
    "symbol": "BOBA",
    "decimals": 18
  },
  "infoURL": "https://docs.boba.network/for-developers/network-avalanche",
  "chainId": 43288,
  "networkId": 43288,
  "explorers": [
    {
      "name": "Boba Avax Explorer",
      "url": "https://blockexplorer.avax.boba.network",
      "standard": "none"
    }
  ]
} satisfies Chain