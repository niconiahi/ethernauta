/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_900 = {
  "name": "Garizon Testnet Stage0",
  "shortName": "gar-test-s0",
  "chain": "GAR",
  "icon": "garizon",
  "rpc": [
    "https://s0-testnet.garizon.net/rpc"
  ],
  "faucets": [
    "https://faucet-testnet.garizon.com"
  ],
  "nativeCurrency": {
    "name": "Garizon",
    "symbol": "GAR",
    "decimals": 18
  },
  "infoURL": "https://garizon.com",
  "chainId": 900,
  "networkId": 900,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer-testnet.garizon.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain