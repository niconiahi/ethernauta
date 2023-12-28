/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_80 = {
  "name": "GeneChain",
  "shortName": "GeneChain",
  "chain": "GeneChain",
  "rpc": [
    "https://rpc.genechain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "RNA",
    "symbol": "RNA",
    "decimals": 18
  },
  "infoURL": "https://scan.genechain.io/",
  "chainId": 80,
  "networkId": 80,
  "explorers": [
    {
      "name": "GeneChain Scan",
      "url": "https://scan.genechain.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain