/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_12052 = {
  "name": "Singularity ZERO Mainnet",
  "shortName": "ZERO",
  "chain": "ZERO",
  "rpc": [
    "https://zerorpc.singularity.gold"
  ],
  "faucets": [
    "https://zeroscan.singularity.gold"
  ],
  "nativeCurrency": {
    "name": "ZERO",
    "symbol": "ZERO",
    "decimals": 18
  },
  "infoURL": "https://www.singularity.gold",
  "chainId": 12052,
  "networkId": 12052,
  "slip44": 621,
  "explorers": [
    {
      "name": "zeroscan",
      "url": "https://zeroscan.singularity.gold",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain