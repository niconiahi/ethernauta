/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_23295 = {
  "name": "Oasis Sapphire Testnet",
  "shortName": "sapphire-testnet",
  "chain": "Sapphire",
  "icon": "oasis",
  "rpc": [
    "https://testnet.sapphire.oasis.dev",
    "wss://testnet.sapphire.oasis.dev/ws"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Sapphire Test Rose",
    "symbol": "TEST",
    "decimals": 18
  },
  "infoURL": "https://docs.oasis.io/dapp/sapphire",
  "chainId": 23295,
  "networkId": 23295,
  "slip44": 1,
  "explorers": [
    {
      "name": "Oasis Sapphire Testnet Explorer",
      "url": "https://testnet.explorer.sapphire.oasis.dev",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain