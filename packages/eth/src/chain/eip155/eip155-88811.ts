/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_88811 = {
  "name": "Unit Zero Mainnet",
  "shortName": "unit0-mainnet",
  "chain": "Unit Zero",
  "icon": "unitzero",
  "rpc": [
    "https://rpc.unit0.dev"
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
    "name": "UNIT0",
    "symbol": "UNIT0",
    "decimals": 18
  },
  "infoURL": "https://units.network",
  "chainId": 88811,
  "networkId": 88811,
  "explorers": []
} satisfies Chain