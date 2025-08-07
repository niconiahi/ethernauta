/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1597 = {
  "name": "Reactive Mainnet",
  "shortName": "react",
  "title": "Reactive Network",
  "chain": "REACT",
  "icon": "reactive",
  "rpc": [
    "https://mainnet-rpc.rnk.dev"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "React",
    "symbol": "REACT",
    "decimals": 18
  },
  "infoURL": "https://reactive.network",
  "chainId": 1597,
  "networkId": 1597,
  "explorers": [
    {
      "name": "Reactscan",
      "url": "https://reactscan.net",
      "standard": "none"
    }
  ]
} satisfies Chain