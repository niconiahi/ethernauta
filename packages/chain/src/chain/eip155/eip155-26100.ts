/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_26100 = {
  "name": "Ferrum Quantum Portal Network",
  "shortName": "qpn",
  "chain": "QPN",
  "icon": "ferrum",
  "rpc": [
    "https://qpn.svcs.ferrumnetwork.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ferrum",
    "symbol": "qpFRM",
    "decimals": 18
  },
  "infoURL": "https://ferrum.network",
  "chainId": 26100,
  "networkId": 26100,
  "explorers": [
    {
      "name": "ferrumscout",
      "url": "https://explorer.ferrumnetwork.io",
      "standard": "none"
    }
  ]
} satisfies Chain