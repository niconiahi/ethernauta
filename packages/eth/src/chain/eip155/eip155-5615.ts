/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_5615 = {
  "name": "Arcturus Testneet",
  "shortName": "arcturus-testnet",
  "chain": "Arcturus",
  "rpc": [
    "https://rpc-testnet.arcturuschain.io/"
  ],
  "faucets": [
    "https://faucet.arcturuschain.io"
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
    "name": "tARC",
    "symbol": "tARC",
    "decimals": 18
  },
  "infoURL": "https://arcturuschain.io",
  "chainId": 5615,
  "networkId": 5615,
  "explorers": [
    {
      "name": "explorer-arcturus-testnet",
      "url": "https://testnet.arcscan.net",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain