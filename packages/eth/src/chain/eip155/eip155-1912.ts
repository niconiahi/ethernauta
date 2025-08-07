/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1912 = {
  "name": "Ruby Smart Chain Testnet",
  "shortName": "tRUBY",
  "chain": "RUBY",
  "icon": "ruby",
  "rpc": [
    "https://testnet-rchain.rubychain.io/"
  ],
  "faucets": [
    "https://claim-faucet.rubychain.io/"
  ],
  "nativeCurrency": {
    "name": "RUBY Smart Chain Native Token",
    "symbol": "tRUBY",
    "decimals": 18
  },
  "infoURL": "https://rubychain.io",
  "chainId": 1912,
  "networkId": 1912,
  "slip44": 1,
  "explorers": [
    {
      "name": "RUBY Smart Chain Testnet Explorer",
      "url": "https://testnet.rubyscan.net",
      "standard": "none"
    }
  ]
} satisfies Chain