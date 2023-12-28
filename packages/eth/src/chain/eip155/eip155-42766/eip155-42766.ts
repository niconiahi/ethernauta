/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_42766 = {
  "name": "ZKFair Mainnet",
  "shortName": "ZKFair-Mainnet",
  "title": "ZKFair Mainnet",
  "chain": "ZKFair",
  "icon": "zkfair",
  "rpc": [
    "https://rpc.zkfair.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "USDC Token",
    "symbol": "USDC",
    "decimals": 18
  },
  "infoURL": "https://zkfair.io",
  "chainId": 42766,
  "networkId": 42766,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://scan.zkfair.io",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://wallet.zkfair.io"
      }
    ]
  }
} satisfies Chain