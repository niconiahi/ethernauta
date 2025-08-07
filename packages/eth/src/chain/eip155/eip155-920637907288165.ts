/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_920637907288165 = {
  "name": "Kakarot Starknet Sepolia",
  "shortName": "kkrt-starknet-sepolia",
  "chain": "ETH",
  "icon": "kakarot",
  "rpc": [
    "https://sepolia-rpc.kakarot.org"
  ],
  "faucets": [
    "https://sepolia-faucet.kakarot.org/"
  ],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://kakarot.org",
  "chainId": 920637907288165,
  "networkId": 920637907288165,
  "explorers": [
    {
      "name": "Kakarot Scan",
      "url": "https://sepolia.kakarotscan.org",
      "standard": "EIP3091"
    },
    {
      "name": "Kakarot Explorer",
      "url": "https://sepolia-explorer.kakarot.org",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": []
  }
} satisfies Chain