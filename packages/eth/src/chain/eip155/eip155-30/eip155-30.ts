/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_30 = {
  "name": "Rootstock Mainnet",
  "shortName": "rsk",
  "chain": "Rootstock",
  "icon": "rootstock",
  "rpc": [
    "https://public-node.rsk.co",
    "https://mycrypto.rsk.co"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Smart Bitcoin",
    "symbol": "RBTC",
    "decimals": 18
  },
  "infoURL": "https://rootstock.io",
  "chainId": 30,
  "networkId": 30,
  "slip44": 137,
  "explorers": [
    {
      "name": "Rootstock Explorer",
      "url": "https://explorer.rsk.co",
      "standard": "EIP3091"
    },
    {
      "name": "blockscout",
      "url": "https://rootstock.blockscout.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain