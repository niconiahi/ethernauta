/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_2868 = {
  "name": "HyperAGI Mainnet",
  "shortName": "hypt",
  "chain": "HyperAGI",
  "rpc": [],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Hyperdust",
    "symbol": "HYPT",
    "decimals": 18
  },
  "infoURL": "https://hyperagi.network",
  "chainId": 2868,
  "networkId": 1,
  "explorers": [
    {
      "name": "hyptscan",
      "url": "https://block.hyperagi.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain