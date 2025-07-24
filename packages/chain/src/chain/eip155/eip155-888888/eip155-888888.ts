/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_888888 = {
  "name": "Vision - Mainnet",
  "shortName": "vision",
  "chain": "Vision",
  "rpc": [
    "https://infragrid.v.network/ethereum/compatible"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "VS",
    "symbol": "VS",
    "decimals": 18
  },
  "infoURL": "https://www.v.network",
  "chainId": 888888,
  "networkId": 888888,
  "slip44": 60,
  "explorers": [
    {
      "name": "Visionscan",
      "url": "https://www.visionscan.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain