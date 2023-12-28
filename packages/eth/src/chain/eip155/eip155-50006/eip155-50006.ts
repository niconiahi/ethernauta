/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_50006 = {
  "name": "Yooldo Verse Testnet",
  "shortName": "YVT",
  "chain": "Yooldo Verse",
  "icon": "yooldo_verse",
  "rpc": [
    "https://rpc.testnet.yooldo-verse.xyz/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "infoURL": "https://yooldo.gg/",
  "chainId": 50006,
  "networkId": 50006,
  "slip44": 1,
  "explorers": [
    {
      "name": "Yooldo Verse Explorer",
      "url": "https://explorer.testnet.yooldo-verse.xyz",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-248"
  }
} satisfies Chain