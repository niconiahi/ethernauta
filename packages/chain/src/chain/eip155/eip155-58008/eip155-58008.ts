/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_58008 = {
  "name": "Sepolia PGN (Public Goods Network)",
  "shortName": "sepPGN",
  "chain": "ETH",
  "icon": "publicGoodsNetwork",
  "rpc": [
    "https://sepolia.publicgoods.network"
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
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://publicgoods.network/",
  "chainId": 58008,
  "networkId": 58008,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.sepolia.publicgoods.network",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://pgn-bridge.vercel.app/bridge"
      }
    ]
  }
} satisfies Chain