/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_42 = {
  "name": "LUKSO Mainnet",
  "shortName": "lukso",
  "chain": "LUKSO",
  "icon": "lukso",
  "rpc": [
    "https://rpc.mainnet.lukso.network",
    "wss://ws-rpc.mainnet.lukso.network"
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
    "name": "LUKSO",
    "symbol": "LYX",
    "decimals": 18
  },
  "infoURL": "https://lukso.network",
  "chainId": 42,
  "networkId": 42,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer.execution.mainnet.lukso.network",
      "standard": "EIP3091"
    }
  ],
  "redFlags": [
    "reusedChainId"
  ]
} satisfies Chain