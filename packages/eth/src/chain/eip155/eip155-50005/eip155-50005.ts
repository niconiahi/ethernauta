/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_50005 = {
  "name": "Yooldo Verse Mainnet",
  "shortName": "YVM",
  "chain": "Yooldo Verse",
  "icon": "yooldo_verse",
  "rpc": [
    "https://rpc.yooldo-verse.xyz/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "infoURL": "https://yooldo.gg/",
  "chainId": 50005,
  "networkId": 50005,
  "explorers": [
    {
      "name": "Yooldo Verse Explorer",
      "url": "https://explorer.yooldo-verse.xyz",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-248"
  }
} satisfies Chain