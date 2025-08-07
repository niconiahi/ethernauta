/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_202 = {
  "name": "Edgeless Testnet",
  "shortName": "edgeless-testnet",
  "chain": "EdgelessTestnet",
  "rpc": [
    "https://testnet.rpc.edgeless.network/http"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "Edgeless Wrapped Eth",
    "symbol": "EwEth",
    "decimals": 18
  },
  "infoURL": "https://edgeless.network",
  "chainId": 202,
  "networkId": 202,
  "explorers": [
    {
      "name": "Edgeless Explorer",
      "url": "https://testnet.explorer.edgeless.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain