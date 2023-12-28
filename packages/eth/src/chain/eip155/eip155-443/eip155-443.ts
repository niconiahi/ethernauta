/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_443 = {
  "name": "Obscuro Testnet",
  "shortName": "obs-testnet",
  "title": "Obscuro Sepolia Rollup Testnet",
  "chain": "ETH",
  "rpc": [
    "https://testnet.obscu.ro"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://obscu.ro",
  "chainId": 443,
  "networkId": 443,
  "slip44": 1,
  "explorers": [
    {
      "name": "Obscuro Sepolia Rollup Explorer",
      "url": "https://testnet.obscuroscan.io",
      "standard": "none"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-5",
    "bridges": [
      {
        "url": "https://bridge.obscu.ro"
      }
    ]
  }
} satisfies Chain