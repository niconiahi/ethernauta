/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_140 = {
  "name": "Eteria Mainnet",
  "shortName": "ERA",
  "chain": "ERA",
  "icon": "eteria",
  "rpc": [
    "https://mainnet.eteria.io/v1"
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
    "name": "Eteria",
    "symbol": "ERA",
    "decimals": 18
  },
  "infoURL": "https://eteria.io",
  "chainId": 140,
  "networkId": 140
} satisfies Chain