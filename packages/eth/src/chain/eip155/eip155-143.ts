/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_143 = {
  "name": "Monad Mainnet",
  "shortName": "mon",
  "chain": "MON",
  "icon": "monad",
  "rpc": [],
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
    "name": "MON Token",
    "symbol": "MON",
    "decimals": 18
  },
  "infoURL": "https://monad.xyz",
  "chainId": 143,
  "networkId": 143,
  "slip44": 1,
  "explorers": []
} satisfies Chain