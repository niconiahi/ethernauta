/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_322202 = {
  "name": "Parex Mainnet",
  "shortName": "parex",
  "title": "Parex Mainnet",
  "chain": "Parex",
  "icon": "parexmain",
  "rpc": [
    "https://mainnet-rpc.parex.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "PAREX",
    "symbol": "PRX",
    "decimals": 18
  },
  "infoURL": "https://parex.network",
  "chainId": 322202,
  "networkId": 322202,
  "explorers": [
    {
      "name": "Parex Mainnet Explorer",
      "url": "https://scan.parex.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain