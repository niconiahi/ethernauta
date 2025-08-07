/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_10143 = {
  "name": "Monad Testnet",
  "shortName": "mon-testnet",
  "chain": "MON",
  "icon": "monad",
  "rpc": [
    "https://testnet-rpc.monad.xyz"
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
    "name": "Testnet MON Token",
    "symbol": "MON",
    "decimals": 18
  },
  "infoURL": "https://monad.xyz",
  "chainId": 10143,
  "networkId": 10143,
  "slip44": 1,
  "explorers": [
    {
      "name": "Monad Testnet Explorer",
      "url": "https://testnet.monadexplorer.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain