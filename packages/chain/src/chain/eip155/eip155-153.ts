/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_153 = {
  "name": "Redbelly Network Testnet",
  "shortName": "rbn-testnet",
  "chain": "RBN",
  "icon": "redbelly",
  "rpc": [
    "https://governors.testnet.redbelly.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Redbelly Network Coin",
    "symbol": "RBNT",
    "decimals": 18
  },
  "infoURL": "https://redbelly.network",
  "chainId": 153,
  "networkId": 153,
  "slip44": 1,
  "explorers": [
    {
      "name": "Routescan",
      "url": "https://redbelly.testnet.routescan.io",
      "standard": "EIP3091"
    }
  ],
  "status": "active"
} satisfies Chain