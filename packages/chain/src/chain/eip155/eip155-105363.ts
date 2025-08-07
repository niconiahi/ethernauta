/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_105363 = {
  "name": "Lumoz Chain Testnet",
  "shortName": "Lumoz-Chain-Testnet",
  "chain": "ETH",
  "icon": "opside-new",
  "rpc": [
    "https://testnet-rpc.lumoz.org"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "Lumoz Testnet Token",
    "symbol": "MOZ",
    "decimals": 18
  },
  "infoURL": "https://lumoz.org",
  "chainId": 105363,
  "networkId": 105363,
  "slip44": 1,
  "explorers": [
    {
      "name": "LumozTestInfo",
      "url": "https://testnet-scan.lumoz.info",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain