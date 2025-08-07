/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_28518 = {
  "name": "Vizing Mainnet",
  "shortName": "Vizing",
  "title": "Vizing Mainnet",
  "chain": "Vizing Mainnet",
  "icon": "vizing",
  "rpc": [
    "https://rpc.vizing.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://vizing.com",
  "chainId": 28518,
  "networkId": 28518,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.vizing.com",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.vizing.com"
      }
    ]
  }
} satisfies Chain