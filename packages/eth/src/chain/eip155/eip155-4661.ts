/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_4661 = {
  "name": "AppChain Testnet",
  "shortName": "appchaintestnet",
  "chain": "AppChain Testnet",
  "icon": "appchain",
  "rpc": [
    "https://appchaintestnet.rpc.caldera.xyz/http",
    "wss://appchaintestnet.rpc.caldera.xyz/ws"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://appchain.xyz",
  "chainId": 4661,
  "networkId": 4661,
  "explorers": [
    {
      "name": "AppChain Testnet Explorer",
      "url": "https://appchaintestnet.explorer.caldera.xyz",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://appchaintestnet.bridge.caldera.xyz"
      }
    ]
  }
} satisfies Chain