/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1818 = {
  "name": "Cube Chain Mainnet",
  "shortName": "cube",
  "chain": "Cube",
  "icon": "cube",
  "rpc": [
    "https://http-mainnet.cube.network",
    "wss://ws-mainnet.cube.network",
    "https://http-mainnet-sg.cube.network",
    "wss://ws-mainnet-sg.cube.network",
    "https://http-mainnet-us.cube.network",
    "wss://ws-mainnet-us.cube.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Cube Chain Native Token",
    "symbol": "CUBE",
    "decimals": 18
  },
  "infoURL": "https://www.cube.network",
  "chainId": 1818,
  "networkId": 1818,
  "slip44": 1818,
  "explorers": [
    {
      "name": "cube-scan",
      "url": "https://cubescan.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain