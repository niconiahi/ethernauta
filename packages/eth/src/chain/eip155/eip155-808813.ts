/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_808813 = {
  "name": "BOB Sepolia",
  "shortName": "bob-sepolia",
  "chain": "ETH",
  "icon": "bob",
  "rpc": [
    "https://bob-sepolia.rpc.gobob.xyz",
    "wss://bob-sepolia.rpc.gobob.xyz"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://gobob.xyz",
  "chainId": 808813,
  "networkId": 808813,
  "explorers": [
    {
      "name": "bobscout",
      "url": "https://bob-sepolia.explorer.gobob.xyz",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://bob-sepolia.gobob.xyz/"
      }
    ]
  },
  "status": "active"
} satisfies Chain