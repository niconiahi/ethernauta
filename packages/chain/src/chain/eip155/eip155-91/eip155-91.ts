/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_91 = {
  "name": "Garizon Stage1",
  "shortName": "gar-s1",
  "chain": "GAR",
  "icon": "garizon",
  "rpc": [
    "https://s1.garizon.net/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Garizon",
    "symbol": "GAR",
    "decimals": 18
  },
  "infoURL": "https://garizon.com",
  "chainId": 91,
  "networkId": 91,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.garizon.com",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "shard",
    "chain": "eip155-90"
  }
} satisfies Chain