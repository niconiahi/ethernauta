/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_111551119090 = {
  "name": "Thanos Sepolia",
  "shortName": "thanos-sepolia",
  "chain": "ETH",
  "rpc": [
    "https://rpc.thanos-sepolia.tokamak.network",
    "wss://rpc.thanos-sepolia.tokamak.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Tokamak Network",
    "symbol": "TON",
    "decimals": 18
  },
  "infoURL": "https://tokamak.network",
  "chainId": 111551119090,
  "networkId": 111551119090,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.thanos-sepolia.tokamak.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain