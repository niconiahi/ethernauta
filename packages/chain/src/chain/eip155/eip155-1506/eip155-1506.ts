/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1506 = {
  "name": "Sherpax Mainnet",
  "shortName": "Sherpax",
  "chain": "Sherpax Mainnet",
  "rpc": [
    "https://mainnet.sherpax.io/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "KSX",
    "symbol": "KSX",
    "decimals": 18
  },
  "infoURL": "https://sherpax.io/",
  "chainId": 1506,
  "networkId": 1506,
  "explorers": [
    {
      "name": "Sherpax Mainnet Explorer",
      "url": "https://evm.sherpax.io",
      "standard": "none"
    }
  ]
} satisfies Chain