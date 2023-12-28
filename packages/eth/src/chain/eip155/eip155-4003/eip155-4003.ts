/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_4003 = {
  "name": "X1 Fastnet",
  "shortName": "x1-fastnet",
  "chain": "X1",
  "rpc": [
    "https://x1-fastnet.xen.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "XN",
    "symbol": "XN",
    "decimals": 18
  },
  "infoURL": "https://docs.xen.network/go-x1/",
  "chainId": 4003,
  "networkId": 4003,
  "slip44": 1,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer.x1-fastnet.xen.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain