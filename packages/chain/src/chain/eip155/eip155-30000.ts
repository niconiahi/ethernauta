/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_30000 = {
  "name": "qChain Mainnet",
  "shortName": "qchain",
  "chain": "qChain",
  "icon": "qchain",
  "rpc": [
    "https://rpc.qchain.kr"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "QCO",
    "symbol": "QCO",
    "decimals": 18
  },
  "infoURL": "https://www.qchain.kr",
  "chainId": 30000,
  "networkId": 30000,
  "explorers": [
    {
      "name": "qChain explorer",
      "url": "https://scan.qchain.kr",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain