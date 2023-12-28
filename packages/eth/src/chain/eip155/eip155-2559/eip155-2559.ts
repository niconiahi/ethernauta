/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2559 = {
  "name": "Kortho Mainnet",
  "shortName": "ktoc",
  "chain": "Kortho Chain",
  "rpc": [
    "https://www.kortho-chain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "KorthoChain",
    "symbol": "KTO",
    "decimals": 11
  },
  "infoURL": "https://www.kortho.io/",
  "chainId": 2559,
  "networkId": 2559
} satisfies Chain