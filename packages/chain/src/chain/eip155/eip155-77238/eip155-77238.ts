/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_77238 = {
  "name": "Foundry Chain Testnet",
  "shortName": "fnc",
  "chain": "tFNC",
  "icon": "fnc",
  "rpc": [
    "https://testnet-rpc.foundryscan.org/"
  ],
  "faucets": [
    "https://faucet.foundryscan.org"
  ],
  "nativeCurrency": {
    "name": "Foundry Chain Testnet",
    "symbol": "tFNC",
    "decimals": 18
  },
  "infoURL": "https://foundrychain.org",
  "chainId": 77238,
  "networkId": 77238,
  "slip44": 1,
  "explorers": [
    {
      "name": "Foundry Scan Testnet",
      "url": "https://testnet-explorer.foundryscan.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain