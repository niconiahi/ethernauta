/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_2043 = {
  "name": "NeuroWeb",
  "shortName": "NEURO",
  "chain": "NEUROWEB",
  "rpc": [
    "https://astrosat.origintrail.network",
    "wss://parachain-rpc.origin-trail.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "NeuroWeb Token",
    "symbol": "NEURO",
    "decimals": 12
  },
  "infoURL": "https://neuroweb.ai",
  "chainId": 2043,
  "networkId": 2043
} satisfies Chain