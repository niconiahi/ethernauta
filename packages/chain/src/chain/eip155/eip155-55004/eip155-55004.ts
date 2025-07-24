/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_55004 = {
  "name": "Titan",
  "shortName": "teth",
  "chain": "ETH",
  "rpc": [
    "https://rpc.titan.tokamak.network",
    "wss://rpc.titan.tokamak.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://tokamak.network",
  "chainId": 55004,
  "networkId": 55004,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.titan.tokamak.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain