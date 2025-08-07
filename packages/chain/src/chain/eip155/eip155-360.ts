/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_360 = {
  "name": "Shape",
  "shortName": "shape",
  "chain": "ETH",
  "icon": "shape",
  "rpc": [
    "https://mainnet.shape.network",
    "https://shape-mainnet.g.alchemy.com/public"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://shape.network",
  "chainId": 360,
  "networkId": 360,
  "explorers": [
    {
      "name": "shapescan",
      "url": "https://shapescan.xyz",
      "standard": "EIP3091"
    }
  ],
  "status": "active"
} satisfies Chain