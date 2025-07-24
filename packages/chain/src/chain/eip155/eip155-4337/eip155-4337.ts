/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_4337 = {
  "name": "Beam",
  "shortName": "beam",
  "chain": "BEAM",
  "icon": "beam",
  "rpc": [
    "https://subnets.avax.network/beam/mainnet/rpc",
    "wss://subnets.avax.network/beam/mainnet/ws"
  ],
  "faucets": [
    "https://faucet.onbeam.com"
  ],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Beam",
    "symbol": "BEAM",
    "decimals": 18
  },
  "infoURL": "https://www.onbeam.com",
  "chainId": 4337,
  "networkId": 4337,
  "explorers": [
    {
      "name": "Beam Explorer",
      "url": "https://subnets.avax.network/beam",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain