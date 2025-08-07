/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1071 = {
  "name": "OpenGPU Mainnet",
  "shortName": "ogpu",
  "chain": "OGPU",
  "icon": "ogpu",
  "rpc": [
    "https://mainnet-rpc.ogpuscan.io",
    "wss://mainnet-rpc.ogpuscan.io"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "OGPU",
    "symbol": "OGPU",
    "decimals": 18
  },
  "infoURL": "https://opengpu.network",
  "chainId": 1071,
  "networkId": 1071,
  "explorers": [
    {
      "name": "OpenGPU Explorer",
      "url": "https://ogpuscan.io",
      "standard": "EIP3091"
    }
  ],
  "redFlags": [
    "reusedChainId"
  ]
} satisfies Chain