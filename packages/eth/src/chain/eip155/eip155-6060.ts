/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_6060 = {
  "name": "BC Hyper Chain Testnet",
  "shortName": "BCH",
  "chain": "BC Hyper Chain",
  "icon": "bchyper",
  "rpc": [
    "https://rpc.bchscan.io"
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
    "name": "TEST VERSATIZE COIN",
    "symbol": "TVTCN",
    "decimals": 18
  },
  "infoURL": "https://www.versatizecoin.com/",
  "chainId": 6060,
  "networkId": 6060,
  "explorers": [
    {
      "name": "bcexplorer testnet",
      "url": "https://testnet.bchscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain