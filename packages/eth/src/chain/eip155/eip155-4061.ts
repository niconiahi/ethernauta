/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_4061 = {
  "name": "Nahmii 3 Mainnet",
  "shortName": "Nahmii3Mainnet",
  "chain": "Nahmii",
  "icon": "nahmii",
  "rpc": [
    "https://rpc.n3.nahmii.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://nahmii.io",
  "chainId": 4061,
  "networkId": 4061,
  "explorers": [
    {
      "name": "Nahmii 3 Mainnet Explorer",
      "url": "https://explorer.nahmii.io",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://accounts.nahmii.io"
      }
    ]
  },
  "status": "active"
} satisfies Chain