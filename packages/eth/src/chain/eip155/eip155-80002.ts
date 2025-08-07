/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_80002 = {
  "name": "Amoy",
  "shortName": "polygonamoy",
  "title": "Polygon Amoy Testnet",
  "chain": "Polygon",
  "icon": "polygon",
  "rpc": [
    "https://rpc-amoy.polygon.technology",
    "https://polygon-amoy-bor-rpc.publicnode.com",
    "wss://polygon-amoy-bor-rpc.publicnode.com"
  ],
  "faucets": [
    "https://faucet.polygon.technology/"
  ],
  "nativeCurrency": {
    "name": "POL",
    "symbol": "POL",
    "decimals": 18
  },
  "infoURL": "https://polygon.technology/",
  "chainId": 80002,
  "networkId": 80002,
  "slip44": 1,
  "explorers": [
    {
      "name": "polygonscan-amoy",
      "url": "https://amoy.polygonscan.com",
      "standard": "EIP3091"
    },
    {
      "name": "polygonamoy",
      "url": "https://www.oklink.com/amoy",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain