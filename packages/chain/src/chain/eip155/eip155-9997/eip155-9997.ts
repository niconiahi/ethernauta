/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_9997 = {
  "name": "AltLayer Testnet",
  "shortName": "alt-testnet",
  "chain": "ETH",
  "icon": "altlayer",
  "rpc": [
    "https://testnet-rollup-api.altlayer.io"
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
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://altlayer.io",
  "chainId": 9997,
  "networkId": 9997,
  "slip44": 1,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet-rollup-explorer.altlayer.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain