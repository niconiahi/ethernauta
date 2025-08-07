/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_13505 = {
  "name": "Gravity Alpha Testnet Sepolia",
  "shortName": "gravitysep",
  "chain": "Gravity",
  "icon": "gravity",
  "rpc": [
    "https://rpc-sepolia.gravity.xyz"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    },
    {
      "name": "EIP1108"
    }
  ],
  "nativeCurrency": {
    "name": "Sepolia Gravity",
    "symbol": "G",
    "decimals": 18
  },
  "infoURL": "https://gravity.xyz",
  "chainId": 13505,
  "networkId": 13505,
  "explorers": [
    {
      "name": "Gravity Alpha Testnet Sepolia Explorer",
      "url": "https://explorer-sepolia.gravity.xyz",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": []
  }
} satisfies Chain