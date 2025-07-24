/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1890 = {
  "name": "Lightlink Phoenix Mainnet",
  "shortName": "lightlink_phoenix",
  "chain": "Lightlink Phoenix Mainnet",
  "icon": "lightlink",
  "rpc": [
    "https://replicator.phoenix.lightlink.io/rpc/v1"
  ],
  "faucets": [],
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
  "chainId": 1890,
  "networkId": 1890,
  "explorers": [
    {
      "name": "phoenix",
      "url": "https://phoenix.lightlink.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain