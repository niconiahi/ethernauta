/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_8000 = {
  "name": "Teleport",
  "shortName": "teleport",
  "chain": "Teleport",
  "icon": "teleport",
  "rpc": [
    "https://evm-rpc.teleport.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Tele",
    "symbol": "TELE",
    "decimals": 18
  },
  "infoURL": "https://teleport.network",
  "chainId": 8000,
  "networkId": 8000,
  "explorers": [
    {
      "name": "Teleport EVM Explorer (Blockscout)",
      "url": "https://evm-explorer.teleport.network",
      "standard": "none"
    },
    {
      "name": "Teleport Cosmos Explorer (Big Dipper)",
      "url": "https://explorer.teleport.network",
      "standard": "none"
    }
  ]
} satisfies Chain