/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_466 = {
  "name": "AppChain",
  "shortName": "appchain",
  "chain": "AppChain",
  "icon": "appchain",
  "rpc": [
    "https://rpc.appchain.xyz/http",
    "wss://rpc.appchain.xyz/ws"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://appchain.xyz",
  "chainId": 466,
  "networkId": 466,
  "explorers": [
    {
      "name": "AppChain Explorer",
      "url": "https://explorer.appchain.xyz",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.appchain.xyz"
      }
    ]
  }
} satisfies Chain