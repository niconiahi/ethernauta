/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_596 = {
  "name": "Karura Network Testnet",
  "shortName": "tkar",
  "chain": "KAR",
  "rpc": [
    "https://eth-rpc-karura-testnet.aca-staging.network",
    "wss://eth-rpc-karura-testnet.aca-staging.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Karura Token",
    "symbol": "KAR",
    "decimals": 18
  },
  "infoURL": "https://karura.network",
  "chainId": 596,
  "networkId": 596,
  "slip44": 1,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.karura-testnet.aca-staging.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain