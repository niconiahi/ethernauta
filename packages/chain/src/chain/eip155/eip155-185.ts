/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_185 = {
  "name": "Mint Mainnet",
  "shortName": "mint",
  "chain": "ETH",
  "icon": "mint",
  "rpc": [
    "https://rpc.mintchain.io",
    "https://global.rpc.mintchain.io",
    "https://asia.rpc.mintchain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://www.mintchain.io",
  "chainId": 185,
  "networkId": 185,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.mintchain.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain