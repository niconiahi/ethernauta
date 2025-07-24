/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_365 = {
  "name": "Theta Testnet",
  "shortName": "theta-testnet",
  "chain": "Theta",
  "rpc": [
    "https://eth-rpc-api-testnet.thetatoken.org/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Theta Fuel",
    "symbol": "TFUEL",
    "decimals": 18
  },
  "infoURL": "https://www.thetatoken.org/",
  "chainId": 365,
  "networkId": 365,
  "slip44": 1,
  "explorers": [
    {
      "name": "Theta Testnet Explorer",
      "url": "https://testnet-explorer.thetatoken.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain