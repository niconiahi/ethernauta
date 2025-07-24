/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_5553 = {
  "name": "Nahmii Testnet",
  "shortName": "NahmiiTestnet",
  "chain": "Nahmii",
  "icon": "nahmii",
  "rpc": [
    "https://l2.testnet.nahmii.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://nahmii.io",
  "chainId": 5553,
  "networkId": 5553,
  "slip44": 1,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.testnet.nahmii.io",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-3",
    "bridges": [
      {
        "url": "https://bridge.nahmii.io"
      }
    ]
  }
} satisfies Chain