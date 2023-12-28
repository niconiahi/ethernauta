/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_12051 = {
  "name": "Singularity ZERO Testnet",
  "shortName": "tZERO",
  "chain": "ZERO",
  "rpc": [
    "https://betaenv.singularity.gold:18545"
  ],
  "faucets": [
    "https://nft.singularity.gold"
  ],
  "nativeCurrency": {
    "name": "ZERO",
    "symbol": "tZERO",
    "decimals": 18
  },
  "infoURL": "https://www.singularity.gold",
  "chainId": 12051,
  "networkId": 12051,
  "slip44": 1,
  "explorers": [
    {
      "name": "zeroscan",
      "url": "https://betaenv.singularity.gold:18002",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain