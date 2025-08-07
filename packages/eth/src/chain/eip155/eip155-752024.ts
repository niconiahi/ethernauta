/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_752024 = {
  "name": "Ternoa Testnet",
  "shortName": "ternoa",
  "chain": "Ternoa",
  "rpc": [
    "https://rpc.zkevm.ternoa.network"
  ],
  "faucets": [
    "https://faucet.zkevm.ternoa.network"
  ],
  "nativeCurrency": {
    "name": "Capsule Coin",
    "symbol": "CAPS",
    "decimals": 18
  },
  "infoURL": "",
  "chainId": 752024,
  "networkId": 7502024,
  "explorers": [
    {
      "name": "Tracehawk",
      "url": "https://explorer.zkevm.ternoa.network",
      "standard": "none"
    }
  ]
} satisfies Chain