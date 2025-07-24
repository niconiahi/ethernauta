/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_99 = {
  "name": "POA Network Core",
  "shortName": "poa",
  "chain": "POA",
  "rpc": [
    "https://core.poa.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "POA Network Core Ether",
    "symbol": "POA",
    "decimals": 18
  },
  "infoURL": "https://poa.network",
  "chainId": 99,
  "networkId": 99,
  "slip44": 178,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.com/poa/core",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain