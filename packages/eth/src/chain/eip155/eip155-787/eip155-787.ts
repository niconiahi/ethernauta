/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_787 = {
  "name": "Acala Network",
  "shortName": "aca",
  "chain": "ACA",
  "rpc": [
    "https://eth-rpc-acala.aca-api.network",
    "wss://eth-rpc-acala.aca-api.network"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Acala Token",
    "symbol": "ACA",
    "decimals": 18
  },
  "infoURL": "https://acala.network",
  "chainId": 787,
  "networkId": 787,
  "slip44": 787,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.acala.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain