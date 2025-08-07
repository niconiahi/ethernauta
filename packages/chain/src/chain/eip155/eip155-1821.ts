/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1821 = {
  "name": "Ruby Smart Chain MAINNET",
  "shortName": "RUBY",
  "chain": "RUBY",
  "icon": "ruby",
  "rpc": [
    "https://mainnet-data.rubychain.io/",
    "https://mainnet.rubychain.io/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "RUBY Smart Chain Native Token",
    "symbol": "RUBY",
    "decimals": 18
  },
  "infoURL": "https://rubychain.io",
  "chainId": 1821,
  "networkId": 1821,
  "slip44": 1,
  "explorers": [
    {
      "name": "RUBY Smart Chain MAINNET Explorer",
      "url": "https://rubyscan.net",
      "standard": "none"
    }
  ]
} satisfies Chain