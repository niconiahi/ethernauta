/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_2410 = {
  "name": "K2 Mainnet",
  "shortName": "K2-mainnet",
  "chain": "K2",
  "icon": "karak",
  "rpc": [
    "https://rpc.karak.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://karak.network",
  "chainId": 2410,
  "networkId": 2410,
  "explorers": [
    {
      "name": "K2 Mainnet Explorer",
      "url": "https://explorer.karak.network",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1"
  }
} satisfies Chain