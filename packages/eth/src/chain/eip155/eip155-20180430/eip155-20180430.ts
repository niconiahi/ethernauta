/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_20180430 = {
  "name": "SmartMesh Mainnet",
  "shortName": "spectrum",
  "chain": "Spectrum",
  "rpc": [
    "https://jsonapi1.smartmesh.cn"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "SmartMesh Native Token",
    "symbol": "SMT",
    "decimals": 18
  },
  "infoURL": "https://smartmesh.io",
  "chainId": 20180430,
  "networkId": 1,
  "explorers": [
    {
      "name": "spectrum",
      "url": "https://spectrum.pub",
      "standard": "none"
    }
  ]
} satisfies Chain