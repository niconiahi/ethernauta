/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_4201 = {
  "name": "LUKSO Testnet",
  "shortName": "lukso-testnet",
  "chain": "LUKSO Testnet",
  "icon": "lukso",
  "rpc": [
    "https://rpc.testnet.lukso.network",
    "wss://ws-rpc.testnet.lukso.network"
  ],
  "faucets": [
    "https://faucet.testnet.lukso.network"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "TestLYX",
    "symbol": "LYXt",
    "decimals": 18
  },
  "infoURL": "https://lukso.network",
  "chainId": 4201,
  "networkId": 4201,
  "slip44": 1,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer.execution.testnet.lukso.network",
      "standard": "none"
    }
  ]
} satisfies Chain