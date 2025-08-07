/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_224 = {
  "name": "Viridis Testnet",
  "shortName": "VRD-Testnet",
  "chain": "VRD",
  "icon": "viridis",
  "rpc": [
    "https://testnet-rpc.vrd.network"
  ],
  "faucets": [
    "https://faucet.vrd.network"
  ],
  "nativeCurrency": {
    "name": "Viridis Token",
    "symbol": "VRD",
    "decimals": 18
  },
  "infoURL": "https://viridis.network",
  "chainId": 224,
  "networkId": 224,
  "explorers": [
    {
      "name": "Viridis Testnet",
      "url": "https://testnet.vrd.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain