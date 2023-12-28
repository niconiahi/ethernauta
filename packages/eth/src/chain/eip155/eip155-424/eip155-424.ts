/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_424 = {
  "name": "PGN (Public Goods Network)",
  "shortName": "PGN",
  "chain": "ETH",
  "icon": "publicGoodsNetwork",
  "rpc": [
    "https://rpc.publicgoods.network"
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
  "infoURL": "https://publicgoods.network/",
  "chainId": 424,
  "networkId": 424,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.publicgoods.network",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.publicgoods.network"
      }
    ]
  }
} satisfies Chain