/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_88817 = {
  "name": "Unit Zero Testnet",
  "shortName": "unit0-testnet",
  "chain": "Unit Zero",
  "icon": "unitzero",
  "rpc": [
    "https://rpc-testnet.unit0.dev"
  ],
  "faucets": [
    "https://faucet-testnet.unit0.dev"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "UNIT0",
    "symbol": "UNIT0",
    "decimals": 18
  },
  "infoURL": "https://units.network",
  "chainId": 88817,
  "networkId": 88817,
  "explorers": [
    {
      "name": "explorer-testnet",
      "url": "https://explorer-testnet.unit0.dev",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain