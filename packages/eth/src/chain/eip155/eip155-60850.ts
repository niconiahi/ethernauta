/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_60850 = {
  "name": "Perennial Sepolia",
  "shortName": "perennial-sepolia",
  "chain": "perennialSepolia",
  "icon": "perennial",
  "rpc": [
    "https://rpc-sepolia.perennial.foundation"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://perennial.finance",
  "chainId": 60850,
  "networkId": 60850,
  "explorers": [
    {
      "name": "Perennial Explorer",
      "url": "https://explorer-sepolia.perennial.foundation",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-84532",
    "bridges": [
      {
        "url": "https://bridge-sepolia.perennial.foundation"
      }
    ]
  }
} satisfies Chain