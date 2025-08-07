/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_41 = {
  "name": "Telos EVM Testnet",
  "shortName": "TelosEVMTestnet",
  "chain": "TLOS",
  "rpc": [
    "https://rpc.testnet.telos.net",
    "https://telos-testnet.drpc.org",
    "wss://telos-testnet.drpc.org"
  ],
  "faucets": [
    "https://app.telos.net/testnet/developers"
  ],
  "nativeCurrency": {
    "name": "Telos",
    "symbol": "TLOS",
    "decimals": 18
  },
  "infoURL": "https://telos.net",
  "chainId": 41,
  "networkId": 41,
  "slip44": 1,
  "explorers": [
    {
      "name": "teloscan",
      "url": "https://testnet.teloscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain