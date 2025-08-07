/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_98866 = {
  "name": "Plume Mainnet",
  "shortName": "plume-mainnet",
  "title": "Plume Ethereum L2 Rollup Mainnet",
  "chain": "PLUME",
  "icon": "plume",
  "rpc": [
    "https://rpc.plume.org",
    "wss://rpc.plume.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Plume",
    "symbol": "PLUME",
    "decimals": 18
  },
  "infoURL": "https://plume.org",
  "chainId": 98866,
  "networkId": 98866,
  "slip44": 1,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer.plume.org",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.plume.org"
      }
    ]
  },
  "status": "active"
} satisfies Chain