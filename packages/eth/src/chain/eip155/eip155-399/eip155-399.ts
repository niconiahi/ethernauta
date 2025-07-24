/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_399 = {
  "name": "Nativ3 Mainnet",
  "shortName": "N3",
  "chain": "Nativ3",
  "icon": "nativ3",
  "rpc": [
    "https://rpc.nativ3.network",
    "wss://ws.nativ3.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "USNT",
    "symbol": "USNT",
    "decimals": 18
  },
  "infoURL": "https://nativ3.network",
  "chainId": 399,
  "networkId": 399,
  "explorers": [
    {
      "name": "N3scan",
      "url": "https://scan.nativ3.network",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-42161",
    "bridges": [
      {
        "url": "https://bridge.nativ3.network"
      }
    ]
  }
} satisfies Chain