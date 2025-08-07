/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_6321 = {
  "name": "Aura Euphoria Testnet",
  "shortName": "eaura",
  "chain": "Aura",
  "icon": "aura",
  "rpc": [
    "https://jsonrpc.euphoria.aura.network"
  ],
  "faucets": [
    "https://aura.faucetme.pro"
  ],
  "nativeCurrency": {
    "name": "test-EAura",
    "symbol": "eAura",
    "decimals": 18
  },
  "infoURL": "https://aura.network",
  "chainId": 6321,
  "networkId": 6321,
  "slip44": 1,
  "explorers": [
    {
      "name": "Aurascan Explorer",
      "url": "https://euphoria.aurascan.io",
      "standard": "none"
    }
  ]
} satisfies Chain