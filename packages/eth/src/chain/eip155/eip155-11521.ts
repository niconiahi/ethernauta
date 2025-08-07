/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_11521 = {
  "name": "SatsChain",
  "shortName": "satschain",
  "chain": "SatsChain",
  "icon": "satschain",
  "rpc": [
    "https://rpc-satschain-1.bevm.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "SATS",
    "symbol": "SATS",
    "decimals": 18
  },
  "infoURL": "https://github.com/BTCSatsNetwork",
  "chainId": 11521,
  "networkId": 11521,
  "explorers": [
    {
      "name": "satschain scan",
      "url": "https://scan-satschain.bevm.io",
      "standard": "none"
    }
  ]
} satisfies Chain