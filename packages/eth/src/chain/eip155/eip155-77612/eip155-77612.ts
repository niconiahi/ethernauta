/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_77612 = {
  "name": "Vention Smart Chain Mainnet",
  "shortName": "vscm",
  "chain": "VSC",
  "icon": "vention",
  "rpc": [
    "https://mainnet-rpc.vention.network"
  ],
  "faucets": [
    "https://faucet.vention.network"
  ],
  "nativeCurrency": {
    "name": "VNT",
    "symbol": "VNT",
    "decimals": 18
  },
  "infoURL": "https://ventionscan.io",
  "chainId": 77612,
  "networkId": 77612,
  "explorers": [
    {
      "name": "ventionscan",
      "url": "https://ventionscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain