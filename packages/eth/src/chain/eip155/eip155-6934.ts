/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_6934 = {
  "name": "Xylume TestNet",
  "shortName": "xyl",
  "chain": "XYL",
  "icon": "xylume-testnet",
  "rpc": [
    "https://xylume-testnet.sparked.network/rpc/"
  ],
  "faucets": [
    "https://debxylen.github.io/Xylume_TestNet/faucet.html"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    },
    {
      "name": "Directed Acyclic Graph (DAG)"
    }
  ],
  "nativeCurrency": {
    "name": "Xylume",
    "symbol": "XYL",
    "decimals": 18
  },
  "infoURL": "https://debxylen.github.io/Xylume_TestNet",
  "chainId": 6934,
  "networkId": 6934,
  "explorers": [
    {
      "name": "Xylume Explorer",
      "url": "https://debxylen.github.io/XylumeExplorer",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain