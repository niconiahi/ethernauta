/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_2478899481 = {
  "name": "Accumulate Kermit",
  "shortName": "Kermit",
  "title": "Accumulate Kermit Testnet",
  "chain": "Accumulate",
  "rpc": [
    "https://kermit.accumulatenetwork.io/eth"
  ],
  "faucets": [
    "https://kermit.explorer.accumulatenetwork.io/faucet"
  ],
  "nativeCurrency": {
    "name": "ACME",
    "symbol": "ACME",
    "decimals": 18
  },
  "infoURL": "https://accumulate.org",
  "chainId": 2478899481,
  "networkId": 2478899481,
  "slip44": 2147483929,
  "explorers": [
    {
      "name": "accumulate-explorer-kermit",
      "url": "https://kermit.explorer.accumulatenetwork.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain