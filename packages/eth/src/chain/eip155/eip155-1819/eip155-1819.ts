/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1819 = {
  "name": "Cube Chain Testnet",
  "shortName": "cubet",
  "chain": "Cube",
  "icon": "cube",
  "rpc": [
    "https://http-testnet.cube.network",
    "wss://ws-testnet.cube.network",
    "https://http-testnet-sg.cube.network",
    "wss://ws-testnet-sg.cube.network",
    "https://http-testnet-jp.cube.network",
    "wss://ws-testnet-jp.cube.network",
    "https://http-testnet-us.cube.network",
    "wss://ws-testnet-us.cube.network"
  ],
  "faucets": [
    "https://faucet.cube.network"
  ],
  "nativeCurrency": {
    "name": "Cube Chain Test Native Token",
    "symbol": "CUBET",
    "decimals": 18
  },
  "infoURL": "https://www.cube.network",
  "chainId": 1819,
  "networkId": 1819,
  "slip44": 1,
  "explorers": [
    {
      "name": "cubetest-scan",
      "url": "https://testnet.cubescan.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain