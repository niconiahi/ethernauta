/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_8001 = {
  "name": "Teleport Testnet",
  "shortName": "teleport-testnet",
  "chain": "Teleport",
  "icon": "teleport",
  "rpc": [
    "https://evm-rpc.testnet.teleport.network"
  ],
  "faucets": [
    "https://chain-docs.teleport.network/testnet/faucet.html"
  ],
  "nativeCurrency": {
    "name": "Tele",
    "symbol": "TELE",
    "decimals": 18
  },
  "infoURL": "https://teleport.network",
  "chainId": 8001,
  "networkId": 8001,
  "slip44": 1,
  "explorers": [
    {
      "name": "Teleport EVM Explorer (Blockscout)",
      "url": "https://evm-explorer.testnet.teleport.network",
      "standard": "none"
    },
    {
      "name": "Teleport Cosmos Explorer (Big Dipper)",
      "url": "https://explorer.testnet.teleport.network",
      "standard": "none"
    }
  ]
} satisfies Chain