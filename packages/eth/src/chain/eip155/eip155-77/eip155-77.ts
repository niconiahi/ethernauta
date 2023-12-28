/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_77 = {
  "name": "POA Network Sokol",
  "shortName": "spoa",
  "chain": "POA",
  "rpc": [
    "https://sokol.poa.network",
    "wss://sokol.poa.network/wss",
    "ws://sokol.poa.network:8546"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "POA Sokol Ether",
    "symbol": "SPOA",
    "decimals": 18
  },
  "infoURL": "https://poa.network",
  "chainId": 77,
  "networkId": 77,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.com/poa/sokol",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain