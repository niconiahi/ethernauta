/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_5551 = {
  "name": "Nahmii Mainnet",
  "shortName": "Nahmii",
  "chain": "Nahmii",
  "icon": "nahmii",
  "rpc": [
    "https://l2.nahmii.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://nahmii.io",
  "chainId": 5551,
  "networkId": 5551,
  "explorers": [
    {
      "name": "Nahmii mainnet explorer",
      "url": "https://explorer.nahmii.io",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.nahmii.io"
      }
    ]
  }
} satisfies Chain