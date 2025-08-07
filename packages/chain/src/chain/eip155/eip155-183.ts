/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_183 = {
  "name": "Ethernity",
  "shortName": "ethernity-mainnet",
  "chain": "Ethernity",
  "icon": "ethernity",
  "rpc": [
    "https://mainnet.ethernitychain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://www.ethernity.io",
  "chainId": 183,
  "networkId": 183,
  "explorers": [
    {
      "name": "Ethernity Explorer",
      "url": "https://ernscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain