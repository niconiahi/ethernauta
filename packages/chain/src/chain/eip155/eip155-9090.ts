/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_9090 = {
  "name": "Inco Gentry Testnet",
  "shortName": "inco-gentry",
  "chain": "INCO",
  "rpc": [
    "https://testnet.inco.org"
  ],
  "faucets": [
    "https://faucet.inco.org"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "INCO",
    "symbol": "INCO",
    "decimals": 18
  },
  "infoURL": "https://www.inco.org",
  "chainId": 9090,
  "networkId": 9090,
  "explorers": [
    {
      "name": "Inco Gentry Testnet Explorer",
      "url": "https://explorer.testnet.inco.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain