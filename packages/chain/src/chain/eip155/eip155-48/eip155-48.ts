/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_48 = {
  "name": "Ennothem Mainnet Proterozoic",
  "shortName": "etmp",
  "chain": "ETMP",
  "icon": "etmp",
  "rpc": [
    "https://rpc.etm.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ennothem",
    "symbol": "ETMP",
    "decimals": 18
  },
  "infoURL": "https://etm.network",
  "chainId": 48,
  "networkId": 48,
  "explorers": [
    {
      "name": "etmpscan",
      "url": "https://etmscan.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain