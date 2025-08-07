/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_810181 = {
  "name": "zkLink Nova Sepolia Testnet",
  "shortName": "zklink-nova-sepolia",
  "chain": "ETH",
  "icon": "zklink-nova",
  "rpc": [
    "https://sepolia.rpc.zklink.io",
    "wss://sepolia.rpc.zklink.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://zklink.io",
  "chainId": 810181,
  "networkId": 810181,
  "slip44": 1,
  "explorers": [
    {
      "name": "zkLink Nova Block Explorer",
      "url": "https://sepolia.explorer.zklink.io",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-59141",
    "bridges": [
      {
        "url": "https://sepolia.portal.zklink.io"
      }
    ]
  }
} satisfies Chain