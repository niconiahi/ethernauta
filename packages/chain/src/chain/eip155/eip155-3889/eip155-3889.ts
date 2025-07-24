/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_3889 = {
  "name": "KalyChain Testnet",
  "shortName": "kalytestnet",
  "chain": "KLC",
  "icon": "kalychain",
  "rpc": [
    "https://testnetrpc.kalychain.io/rpc"
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
    "name": "KalyCoin",
    "symbol": "KLC",
    "decimals": 18
  },
  "infoURL": "https://kalychain.io",
  "chainId": 3889,
  "networkId": 3889,
  "slip44": 1,
  "explorers": [
    {
      "name": "KalyScan",
      "url": "https://testnet.kalyscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain