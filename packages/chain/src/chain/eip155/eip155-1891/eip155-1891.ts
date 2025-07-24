/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1891 = {
  "name": "Lightlink Pegasus Testnet",
  "shortName": "lightlink_pegasus",
  "chain": "Lightlink Pegasus Testnet",
  "icon": "lightlink",
  "rpc": [
    "https://replicator.pegasus.lightlink.io/rpc/v1"
  ],
  "faucets": [
    "https://faucet.pegasus.lightlink.io/"
  ],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "Ethereum",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://lightlink.io",
  "chainId": 1891,
  "networkId": 1891,
  "slip44": 1,
  "explorers": [
    {
      "name": "pegasus",
      "url": "https://pegasus.lightlink.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain