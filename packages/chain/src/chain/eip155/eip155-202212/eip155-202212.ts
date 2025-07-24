/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_202212 = {
  "name": "X1 Devnet",
  "shortName": "x1-devnet",
  "chain": "X1",
  "rpc": [
    "https://x1-devnet.xen.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "XN",
    "symbol": "XN",
    "decimals": 18
  },
  "infoURL": "https://docs.xen.network/x1/",
  "chainId": 202212,
  "networkId": 202212,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer.x1-devnet.xen.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain