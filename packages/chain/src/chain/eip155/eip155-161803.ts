/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_161803 = {
  "name": "Eventum Mainnet",
  "shortName": "Eventum",
  "chain": "Eventum",
  "icon": "eventum",
  "rpc": [
    "https://mainnet-rpc.evedex.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://evedex.com",
  "chainId": 161803,
  "networkId": 161803,
  "explorers": [
    {
      "name": "Eventum Mainnet Explorer",
      "url": "https://explorer.evedex.com",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.arbitrum.io"
      }
    ]
  }
} satisfies Chain