/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_535037 = {
  "name": "BeanEco SmartChain",
  "shortName": "BESC",
  "title": "BESC Mainnet",
  "chain": "BESC",
  "rpc": [
    "https://mainnet-rpc.bescscan.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BeanEco SmartChain",
    "symbol": "BESC",
    "decimals": 18
  },
  "infoURL": "besceco.finance",
  "chainId": 535037,
  "networkId": 535037,
  "explorers": [
    {
      "name": "bescscan",
      "url": "https://Bescscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain