/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_380 = {
  "name": "ZKAmoeba Testnet",
  "shortName": "zkamoeba-test",
  "chain": "FIL",
  "icon": "zkamoeba-micro",
  "rpc": [
    "https://rpc.testnet.zkamoeba.com:4050/",
    "https://rpc1.testnet.zkamoeba.com:4050/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "filecoin",
    "symbol": "FIL",
    "decimals": 18
  },
  "infoURL": "https://testnet.zkamoeba.com",
  "chainId": 380,
  "networkId": 380,
  "explorers": [
    {
      "name": "ZKAmoeba Test Explorer",
      "url": "https://testnetexplorer.zkamoeba.com",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-314",
    "bridges": [
      {
        "url": "https://testnet.zkamoeba.com/en/bridge"
      }
    ]
  }
} satisfies Chain