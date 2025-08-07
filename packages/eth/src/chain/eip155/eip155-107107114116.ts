/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_107107114116 = {
  "name": "Kakarot Sepolia Deprecated",
  "shortName": "kkrt-sepolia-deprecated",
  "chain": "ETH",
  "icon": "kakarot",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://kakarot.org",
  "chainId": 107107114116,
  "networkId": 107107114116,
  "explorers": [],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": []
  }
} satisfies Chain