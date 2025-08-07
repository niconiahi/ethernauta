/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_53302 = {
  "name": "Superseed Sepolia Testnet",
  "shortName": "seedsep",
  "chain": "ETH",
  "icon": "seedTestnet",
  "rpc": [
    "https://sepolia.superseed.xyz",
    "wss://sepolia.superseed.xyz"
  ],
  "faucets": [
    "https://sepoliafaucet.com"
  ],
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://www.superseed.xyz",
  "chainId": 53302,
  "networkId": 53302,
  "slip44": 1,
  "explorers": [
    {
      "name": "seedscout",
      "url": "https://sepolia-explorer.superseed.xyz",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://sepolia-bridge.superseed.xyz/"
      }
    ]
  }
} satisfies Chain