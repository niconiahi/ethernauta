/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_486487 = {
  "name": "Gobbl Testnet",
  "shortName": "gbl-testnet",
  "chain": "Gobbl Testnet",
  "icon": "gobbl",
  "rpc": [
    "https://rpc.gobbl.io"
  ],
  "faucets": [
    "https://faucet.gobbl.io"
  ],
  "nativeCurrency": {
    "name": "Gobbl Token",
    "symbol": "GOBBL",
    "decimals": 18
  },
  "infoURL": "https://www.gobbl.io/",
  "chainId": 486487,
  "networkId": 486487,
  "explorers": [
    {
      "name": "Gobbl Testnet Explorer",
      "url": "https://explorer.gobbl.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain