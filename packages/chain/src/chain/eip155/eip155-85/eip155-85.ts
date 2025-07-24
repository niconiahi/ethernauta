/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_85 = {
  "name": "GateChain Testnet",
  "shortName": "gttest",
  "chain": "GTTEST",
  "rpc": [
    "https://testnet.gatenode.cc"
  ],
  "faucets": [
    "https://www.gatescan.org/testnet/faucet"
  ],
  "nativeCurrency": {
    "name": "GateToken",
    "symbol": "GT",
    "decimals": 18
  },
  "infoURL": "https://www.gatechain.io",
  "chainId": 85,
  "networkId": 85,
  "slip44": 1,
  "explorers": [
    {
      "name": "GateScan",
      "url": "https://www.gatescan.org/testnet",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain