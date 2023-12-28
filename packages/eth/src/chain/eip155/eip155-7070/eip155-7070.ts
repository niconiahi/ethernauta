/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_7070 = {
  "name": "Planq Mainnet",
  "shortName": "planq",
  "chain": "Planq",
  "icon": "planq",
  "rpc": [
    "https://evm-rpc.planq.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Planq",
    "symbol": "PLQ",
    "decimals": 18
  },
  "infoURL": "https://planq.network",
  "chainId": 7070,
  "networkId": 7070,
  "explorers": [
    {
      "name": "Planq EVM Explorer (Blockscout)",
      "url": "https://evm.planq.network",
      "standard": "none"
    },
    {
      "name": "Planq Cosmos Explorer (BigDipper)",
      "url": "https://explorer.planq.network",
      "standard": "none"
    }
  ]
} satisfies Chain