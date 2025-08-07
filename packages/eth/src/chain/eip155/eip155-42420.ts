/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_42420 = {
  "name": "Asset Chain Mainnet",
  "shortName": "assetchain",
  "chain": "Asset Chain",
  "icon": "assetchain",
  "rpc": [
    "https://mainnet-rpc.assetchain.org"
  ],
  "faucets": [
    "https://faucet.assetchain.org"
  ],
  "nativeCurrency": {
    "name": "Real World Asset",
    "symbol": "RWA",
    "decimals": 18
  },
  "infoURL": "https://docs.assetchain.org",
  "chainId": 42420,
  "networkId": 42420,
  "explorers": [
    {
      "name": "Asset Chain Explorer",
      "url": "https://scan.assetchain.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain