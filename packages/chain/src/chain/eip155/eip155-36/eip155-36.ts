/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_36 = {
  "name": "Dxchain Mainnet",
  "shortName": "dx",
  "chain": "Dxchain",
  "icon": "dx",
  "rpc": [
    "https://mainnet.dxchain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Dxchain",
    "symbol": "DX",
    "decimals": 18
  },
  "infoURL": "https://www.dxchain.com/",
  "chainId": 36,
  "networkId": 36,
  "explorers": [
    {
      "name": "dxscan",
      "url": "https://dxscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain