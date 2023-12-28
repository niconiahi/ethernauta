/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_86 = {
  "name": "GateChain Mainnet",
  "shortName": "gt",
  "chain": "GT",
  "rpc": [
    "https://evm.gatenode.cc"
  ],
  "faucets": [
    "https://www.gatescan.org/faucet"
  ],
  "nativeCurrency": {
    "name": "GateToken",
    "symbol": "GT",
    "decimals": 18
  },
  "infoURL": "https://www.gatechain.io",
  "chainId": 86,
  "networkId": 86,
  "explorers": [
    {
      "name": "GateScan",
      "url": "https://www.gatescan.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain