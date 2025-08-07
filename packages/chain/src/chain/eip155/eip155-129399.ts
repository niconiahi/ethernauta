/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_129399 = {
  "name": "Tatara Testnet",
  "shortName": "Tatara",
  "chain": "Tatara",
  "icon": "ethereum",
  "rpc": [
    "https://rpc.tatara.katanarpc.com/"
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
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "",
  "chainId": 129399,
  "networkId": 129399,
  "explorers": [
    {
      "name": "Tatara explorer",
      "url": "https://explorer.tatara.katana.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain