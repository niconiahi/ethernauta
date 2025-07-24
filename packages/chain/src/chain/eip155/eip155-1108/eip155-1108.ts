/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1108 = {
  "name": "BLXq Mainnet",
  "shortName": "blxq",
  "chain": "BLXQ",
  "icon": "blxq",
  "rpc": [
    "https://mainnet.blxq.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BLXQ",
    "symbol": "BLXQ",
    "decimals": 18
  },
  "infoURL": "https://blx.org",
  "chainId": 1108,
  "networkId": 1108,
  "explorers": [
    {
      "name": "BLXq Explorer",
      "url": "https://explorer.blxq.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain