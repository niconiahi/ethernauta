/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_42261 = {
  "name": "Oasis Emerald Testnet",
  "shortName": "emerald-testnet",
  "chain": "Emerald",
  "icon": "oasis",
  "rpc": [
    "https://testnet.emerald.oasis.dev/",
    "wss://testnet.emerald.oasis.dev/ws"
  ],
  "faucets": [
    "https://faucet.testnet.oasis.dev/"
  ],
  "nativeCurrency": {
    "name": "Emerald Rose",
    "symbol": "ROSE",
    "decimals": 18
  },
  "infoURL": "https://docs.oasis.io/dapp/emerald",
  "chainId": 42261,
  "networkId": 42261,
  "slip44": 1,
  "explorers": [
    {
      "name": "Oasis Emerald Testnet Explorer",
      "url": "https://testnet.explorer.emerald.oasis.dev",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain