/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_443 = {
  "name": "Ten Testnet",
  "shortName": "ten-testnet",
  "title": "Ten Sepolia Rollup Testnet",
  "chain": "ETH",
  "rpc": [
    "https://testnet.ten.xyz"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://ten.xyz",
  "chainId": 443,
  "networkId": 443,
  "slip44": 1,
  "explorers": [
    {
      "name": "Ten Sepolia Rollup Explorer",
      "url": "https://tenscan.io",
      "standard": "none"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-5",
    "bridges": [
      {
        "url": "https://bridge.ten.xyz"
      }
    ]
  }
} satisfies Chain