/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_108160679 = {
  "name": "Oraichain Mainnet",
  "shortName": "Oraichain",
  "title": "Oraichain Mainnet",
  "chain": "Oraichain",
  "rpc": [
    "https://evm.orai.io"
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
    "name": "Oraichain Token",
    "symbol": "ORAI",
    "decimals": 18
  },
  "infoURL": "https://orai.io",
  "chainId": 108160679,
  "networkId": 108160679
} satisfies Chain