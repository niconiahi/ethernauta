/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_39656 = {
  "name": "PRM Mainnet",
  "shortName": "prm",
  "chain": "prm",
  "icon": "prmIcon",
  "rpc": [
    "https://mainnet-rpc.prmscan.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Primal Network",
    "symbol": "PRM",
    "decimals": 18
  },
  "infoURL": "https://primalnetwork.org",
  "chainId": 39656,
  "networkId": 39656,
  "explorers": [
    {
      "name": "Primal Network",
      "url": "https://prmscan.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain