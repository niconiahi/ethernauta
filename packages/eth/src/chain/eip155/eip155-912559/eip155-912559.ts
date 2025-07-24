/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_912559 = {
  "name": "Astria EVM Dusknet",
  "shortName": "ria-dev",
  "chain": "RIA",
  "icon": "astria",
  "rpc": [
    "https://rpc.evm.dusk-2.devnet.astria.org"
  ],
  "faucets": [
    "https://faucet.evm.dusk-2.devnet.astria.org/"
  ],
  "nativeCurrency": {
    "name": "RIA",
    "symbol": "RIA",
    "decimals": 18
  },
  "infoURL": "https://docs.astria.org",
  "chainId": 912559,
  "networkId": 912559,
  "explorers": [
    {
      "name": "Astria EVM Dusknet Explorer",
      "url": "https://explorer.evm.dusk-2.devnet.astria.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain