/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_555 = {
  "name": "Vela1 Chain Mainnet",
  "shortName": "CLASS",
  "chain": "VELA1",
  "rpc": [
    "https://rpc.velaverse.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "CLASS COIN",
    "symbol": "CLASS",
    "decimals": 18
  },
  "infoURL": "https://velaverse.io",
  "chainId": 555,
  "networkId": 555,
  "explorers": [
    {
      "name": "Vela1 Chain Mainnet Explorer",
      "url": "https://exp.velaverse.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain