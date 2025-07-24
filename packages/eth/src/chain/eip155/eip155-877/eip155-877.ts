/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_877 = {
  "name": "Dexit Network",
  "shortName": "DXT",
  "chain": "DXT",
  "rpc": [
    "https://dxt.dexit.network"
  ],
  "faucets": [
    "https://faucet.dexit.network"
  ],
  "nativeCurrency": {
    "name": "Dexit network",
    "symbol": "DXT",
    "decimals": 18
  },
  "infoURL": "https://dexit.network",
  "chainId": 877,
  "networkId": 877,
  "explorers": [
    {
      "name": "dxtscan",
      "url": "https://dxtscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain