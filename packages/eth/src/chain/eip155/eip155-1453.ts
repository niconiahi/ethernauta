/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1453 = {
  "name": "MetaChain Istanbul",
  "shortName": "metatimeistanbul",
  "title": "MetaChain Testnet Istanbul",
  "chain": "MTC",
  "icon": "metachain",
  "rpc": [
    "https://istanbul-rpc.metachain.dev"
  ],
  "faucets": [
    "https://istanbul-faucet.metachain.dev"
  ],
  "nativeCurrency": {
    "name": "Metatime Coin",
    "symbol": "MTC",
    "decimals": 18
  },
  "infoURL": "https://metatime.com/en",
  "chainId": 1453,
  "networkId": 1453,
  "slip44": 1453,
  "explorers": [
    {
      "name": "MetaExplorer",
      "url": "https://istanbul-explorer.metachain.dev",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain