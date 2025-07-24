/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1881 = {
  "name": "Gitshock Cartenz Testnet",
  "shortName": "gitshockchain",
  "chain": "Gitshock Cartenz",
  "icon": "gitshockchain",
  "rpc": [
    "https://rpc.cartenz.works"
  ],
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
    "name": "Gitshock Cartenz",
    "symbol": "tGTFX",
    "decimals": 18
  },
  "infoURL": "https://gitshock.com",
  "chainId": 1881,
  "networkId": 1881,
  "slip44": 1,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://scan.cartenz.works",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain