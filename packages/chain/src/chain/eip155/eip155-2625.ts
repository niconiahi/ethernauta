/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_2625 = {
  "name": "Whitechain Testnet",
  "shortName": "twbt",
  "chain": "WBT",
  "icon": "whitechain-testnet",
  "rpc": [
    "https://rpc-testnet.whitechain.io"
  ],
  "faucets": [
    "https://testnet.whitechain.io/faucet"
  ],
  "nativeCurrency": {
    "name": "WhiteBIT Coin",
    "symbol": "WBT",
    "decimals": 18
  },
  "infoURL": "https://whitechain.io",
  "chainId": 2625,
  "networkId": 2625,
  "slip44": 1,
  "explorers": [
    {
      "name": "whitechain-testnet-explorer",
      "url": "https://testnet.whitechain.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain