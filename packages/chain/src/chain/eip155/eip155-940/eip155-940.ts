/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_940 = {
  "name": "PulseChain Testnet",
  "shortName": "tpls",
  "chain": "tPLS",
  "rpc": [
    "https://rpc.v2.testnet.pulsechain.com/",
    "wss://rpc.v2.testnet.pulsechain.com/"
  ],
  "faucets": [
    "https://faucet.v2.testnet.pulsechain.com/"
  ],
  "nativeCurrency": {
    "name": "Test Pulse",
    "symbol": "tPLS",
    "decimals": 18
  },
  "infoURL": "https://pulsechain.com/",
  "chainId": 940,
  "networkId": 940,
  "slip44": 1,
  "status": "deprecated"
} satisfies Chain