/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2358 = {
  "name": "Kroma Sepolia",
  "shortName": "kroma-sepolia",
  "title": "Kroma Testnet Sepolia",
  "chain": "ETH",
  "icon": "kroma",
  "rpc": [
    "https://api.sepolia.kroma.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://kroma.network",
  "chainId": 2358,
  "networkId": 2358,
  "slip44": 1,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.sepolia.kroma.network",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://kroma.network/bridge"
      }
    ]
  }
} satisfies Chain