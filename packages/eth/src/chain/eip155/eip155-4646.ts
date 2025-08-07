/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_4646 = {
  "name": "MST Chain",
  "shortName": "mst",
  "title": "MST Chain",
  "chain": "MST",
  "icon": "mst",
  "rpc": [
    "https://mariorpc.mstblockchain.com",
    "https://craftrpc.mstblockchain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "MST",
    "symbol": "MST",
    "decimals": 18
  },
  "infoURL": "https://mstblockchain.com",
  "chainId": 4646,
  "networkId": 4646,
  "slip44": 4646,
  "explorers": [
    {
      "name": "MST Mainnet Scan",
      "url": "https://mstscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain