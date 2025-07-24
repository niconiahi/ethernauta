/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_941 = {
  "name": "PulseChain Testnet v2b",
  "shortName": "t2bpls",
  "chain": "t2bPLS",
  "rpc": [
    "https://rpc.v2b.testnet.pulsechain.com/",
    "wss://rpc.v2b.testnet.pulsechain.com/"
  ],
  "faucets": [
    "https://faucet.v2b.testnet.pulsechain.com/"
  ],
  "nativeCurrency": {
    "name": "Test Pulse",
    "symbol": "tPLS",
    "decimals": 18
  },
  "infoURL": "https://pulsechain.com/",
  "chainId": 941,
  "networkId": 941,
  "slip44": 1,
  "status": "deprecated"
} satisfies Chain