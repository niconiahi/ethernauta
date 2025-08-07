/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_4243 = {
  "name": "Nexi V2 Mainnet",
  "shortName": "NexiV2",
  "chain": "Nexi V2",
  "icon": "nexi",
  "rpc": [
    "https://chain.nexiv2.nexilix.com",
    "https://rpc.chainv1.nexi.technology"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "NexiV2",
    "symbol": "NEXI",
    "decimals": 18
  },
  "infoURL": "https://www.nexi.technology/",
  "chainId": 4243,
  "networkId": 4243,
  "slip44": 2500,
  "explorers": [
    {
      "name": "nexiscan",
      "url": "https://www.nexiscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain