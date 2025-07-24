/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_8082 = {
  "name": "Shardeum Sphinx 1.X",
  "shortName": "Sphinx10",
  "chain": "Shardeum",
  "icon": "shardeum",
  "rpc": [
    "https://sphinx.shardeum.org/"
  ],
  "faucets": [
    "https://faucet-sphinx.shardeum.org/"
  ],
  "nativeCurrency": {
    "name": "Shardeum SHM",
    "symbol": "SHM",
    "decimals": 18
  },
  "infoURL": "https://docs.shardeum.org/",
  "chainId": 8082,
  "networkId": 8082,
  "explorers": [
    {
      "name": "Shardeum Scan",
      "url": "https://explorer-sphinx.shardeum.org",
      "standard": "EIP3091"
    }
  ],
  "redFlags": [
    "reusedChainId"
  ]
} satisfies Chain