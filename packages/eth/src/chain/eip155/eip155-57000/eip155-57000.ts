/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_57000 = {
  "name": "Rollux Testnet",
  "shortName": "tsys-rollux",
  "chain": "SYS",
  "rpc": [
    "https://rpc-tanenbaum.rollux.com",
    "https://rpc.ankr.com/rollux_testnet/${ANKR_API_KEY}",
    "wss://rpc-tanenbaum.rollux.com/wss"
  ],
  "faucets": [
    "https://rollux.id/faucetapp"
  ],
  "nativeCurrency": {
    "name": "Testnet Syscoin",
    "symbol": "TSYS",
    "decimals": 18
  },
  "infoURL": "https://rollux.com",
  "chainId": 57000,
  "networkId": 57000,
  "slip44": 1,
  "explorers": [
    {
      "name": "Rollux Testnet Explorer",
      "url": "https://rollux.tanenbaum.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain