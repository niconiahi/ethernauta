/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_383414847825 = {
  "name": "Zeniq",
  "shortName": "zeniq",
  "chain": "ZENIQ",
  "rpc": [
    "https://smart.zeniq.network:9545"
  ],
  "faucets": [
    "https://faucet.zeniq.net/"
  ],
  "nativeCurrency": {
    "name": "Zeniq",
    "symbol": "ZENIQ",
    "decimals": 18
  },
  "infoURL": "https://www.zeniq.dev/",
  "chainId": 383414847825,
  "networkId": 383414847825,
  "explorers": [
    {
      "name": "zeniq-smart-chain-explorer",
      "url": "https://smart.zeniq.net",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain