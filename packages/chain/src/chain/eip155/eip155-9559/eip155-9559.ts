/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_9559 = {
  "name": "Neonlink Testnet",
  "shortName": "testneon",
  "chain": "Neonlink",
  "icon": "neonlink",
  "rpc": [
    "https://testnet.neonlink.io"
  ],
  "faucets": [
    "https://faucet.neonlink.io/"
  ],
  "nativeCurrency": {
    "name": "Neonlink Native Token",
    "symbol": "tNEON",
    "decimals": 18
  },
  "infoURL": "https://neonlink.io",
  "chainId": 9559,
  "networkId": 9559,
  "slip44": 1,
  "explorers": [
    {
      "name": "Neon Blockchain Explorer",
      "url": "https://testnet-scan.neonlink.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain