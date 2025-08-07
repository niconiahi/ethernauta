/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_12325 = {
  "name": "L3X Protocol Testnet",
  "shortName": "l3x-testnet",
  "chain": "L3X",
  "icon": "l3x",
  "rpc": [
    "https://rpc-testnet.l3x.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://l3x.com",
  "chainId": 12325,
  "networkId": 12325,
  "explorers": [
    {
      "name": "L3X Testnet Explorer",
      "url": "https://explorer-testnet.l3x.com",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-421614",
    "bridges": [
      {
        "url": "https://bridge.arbitrum.io"
      }
    ]
  }
} satisfies Chain