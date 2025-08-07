/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_47763 = {
  "name": "Neo X Mainnet",
  "shortName": "neox-mainnet",
  "chain": "Neo X",
  "icon": "neox",
  "rpc": [
    "https://mainnet-1.rpc.banelabs.org",
    "https://mainnet-2.rpc.banelabs.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Gas",
    "symbol": "GAS",
    "decimals": 18
  },
  "infoURL": "https://neo.org/",
  "chainId": 47763,
  "networkId": 47763,
  "explorers": [
    {
      "name": "Neo X - Explorer",
      "url": "https://xexplorer.neo.org",
      "standard": "EIP3091"
    }
  ],
  "status": "active"
} satisfies Chain