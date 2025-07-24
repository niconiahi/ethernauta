/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_356256156 = {
  "name": "Gather Testnet Network",
  "shortName": "tGTH",
  "chain": "GTH",
  "icon": "gather",
  "rpc": [
    "https://testnet.gather.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Gather",
    "symbol": "GTH",
    "decimals": 18
  },
  "infoURL": "https://gather.network",
  "chainId": 356256156,
  "networkId": 356256156,
  "slip44": 1,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://testnet-explorer.gather.network",
      "standard": "none"
    }
  ]
} satisfies Chain