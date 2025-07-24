/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_92 = {
  "name": "Garizon Stage2",
  "shortName": "gar-s2",
  "chain": "GAR",
  "icon": "garizon",
  "rpc": [
    "https://s2.garizon.net/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Garizon",
    "symbol": "GAR",
    "decimals": 18
  },
  "infoURL": "https://garizon.com",
  "chainId": 92,
  "networkId": 92,
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