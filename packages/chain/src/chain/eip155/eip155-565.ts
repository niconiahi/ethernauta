/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_565 = {
  "name": "Prometheuz Testnet",
  "shortName": "prometheuz-testnet",
  "chain": "Prometheuz",
  "rpc": [
    "https://explorer.testnet.prometheuz.io"
  ],
  "faucets": [
    "https://faucet.testnet.prometheuz.io"
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
    "name": "Pyre",
    "symbol": "PYRE",
    "decimals": 18
  },
  "infoURL": "",
  "chainId": 565,
  "networkId": 565,
  "explorers": [
    {
      "name": "Prometheuz Explorer",
      "url": "https://explorer.testnet.prometheuz.io",
      "standard": "none"
    }
  ]
} satisfies Chain