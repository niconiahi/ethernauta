/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_93 = {
  "name": "Garizon Stage3",
  "shortName": "gar-s3",
  "chain": "GAR",
  "icon": "garizon",
  "rpc": [
    "https://s3.garizon.net/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Garizon",
    "symbol": "GAR",
    "decimals": 18
  },
  "infoURL": "https://garizon.com",
  "chainId": 93,
  "networkId": 93,
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