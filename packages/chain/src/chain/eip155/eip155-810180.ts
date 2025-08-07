/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_810180 = {
  "name": "zkLink Nova Mainnet",
  "shortName": "zklink-nova",
  "chain": "ETH",
  "icon": "zklink-nova",
  "rpc": [
    "https://rpc.zklink.io",
    "wss://rpc.zklink.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://zklink.io",
  "chainId": 810180,
  "networkId": 810180,
  "slip44": 1,
  "explorers": [
    {
      "name": "zkLink Nova Block Explorer",
      "url": "https://explorer.zklink.io",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-59144",
    "bridges": [
      {
        "url": "https://portal.zklink.io"
      }
    ]
  }
} satisfies Chain