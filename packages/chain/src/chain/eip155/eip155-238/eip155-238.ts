/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_238 = {
  "name": "Blast Mainnet",
  "shortName": "blast",
  "chain": "ETH",
  "icon": "blastIcon",
  "rpc": [
    "https://rpc.blastblockchain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://docs.blastblockchain.com",
  "chainId": 238,
  "networkId": 238,
  "explorers": [
    {
      "name": "Blast Mainnet",
      "url": "https://scan.blastblockchain.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain