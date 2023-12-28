/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_486217935 = {
  "name": "Gather Devnet Network",
  "shortName": "dGTH",
  "chain": "GTH",
  "rpc": [
    "https://devnet.gather.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Gather",
    "symbol": "GTH",
    "decimals": 18
  },
  "infoURL": "https://gather.network",
  "chainId": 486217935,
  "networkId": 486217935,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://devnet-explorer.gather.network",
      "standard": "none"
    }
  ]
} satisfies Chain