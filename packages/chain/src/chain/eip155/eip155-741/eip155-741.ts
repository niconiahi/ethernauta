/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_741 = {
  "name": "Vention Smart Chain Testnet",
  "shortName": "vsct",
  "chain": "VSCT",
  "icon": "ventionTestnet",
  "rpc": [
    "https://node-testnet.vention.network"
  ],
  "faucets": [
    "https://faucet.vention.network"
  ],
  "nativeCurrency": {
    "name": "VNT",
    "symbol": "VNT",
    "decimals": 18
  },
  "infoURL": "https://testnet.ventionscan.io",
  "chainId": 741,
  "networkId": 741,
  "slip44": 1,
  "explorers": [
    {
      "name": "ventionscan",
      "url": "https://testnet.ventionscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain