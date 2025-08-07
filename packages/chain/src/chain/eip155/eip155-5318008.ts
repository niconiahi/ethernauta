/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_5318008 = {
  "name": "Reactive Kopli",
  "shortName": "kreact",
  "title": "Reactive Network Testnet Kopli",
  "chain": "REACT",
  "icon": "reactive",
  "rpc": [
    "https://kopli-rpc.rnk.dev"
  ],
  "faucets": [
    "https://dev.reactive.network/docs/kopli-testnet#faucet"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Kopli React",
    "symbol": "REACT",
    "decimals": 18
  },
  "infoURL": "https://reactive.network",
  "chainId": 5318008,
  "networkId": 5318008,
  "explorers": [
    {
      "name": "Reactscan",
      "url": "https://kopli.reactscan.net",
      "standard": "none"
    }
  ]
} satisfies Chain