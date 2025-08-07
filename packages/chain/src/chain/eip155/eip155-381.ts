/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_381 = {
  "name": "ZKAmoeba Mainnet",
  "shortName": "zkamoeba",
  "chain": "FIL",
  "icon": "zkamoeba-micro",
  "rpc": [
    "https://rpc.mainnet.zkamoeba.com/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "filecoin",
    "symbol": "FIL",
    "decimals": 18
  },
  "infoURL": "https://www.zkamoeba.com",
  "chainId": 381,
  "networkId": 381,
  "explorers": [
    {
      "name": "ZKAmoeba Explorer",
      "url": "https://explorer.zkamoeba.com",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-314",
    "bridges": [
      {
        "url": "https://www.zkamoeba.com/en/bridge"
      }
    ]
  }
} satisfies Chain